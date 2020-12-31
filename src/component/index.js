import React from 'react';
import PropTypes from 'prop-types';
import FlipMove from 'react-flip-move';

const UploadIcon = `<svg enable-background="new 0 0 64 64" height="64px" id="Layer_1" version="1.1" viewBox="0 0 64 64" width="64px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="   M10,41.3v12c0,1.1,0.9,2,2,2h40c1.1,0,2-0.9,2-2v-12H10z" fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path d="   M42.6,19.4c3.8,7.3,7.6,14.7,11.4,22c-14.7,0-29.3,0-44,0c3.8-7.3,7.6-14.7,11.4-22" fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><g><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="32" x2="32" y1="8.7" y2="28.2"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="32" x2="35.7" y1="8.7" y2="12.4"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="28" x2="31.7" y1="12.4" y2="8.7"/></g><circle cx="47.3" cy="46.7" fill="none" r="2.3" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="21.4" x2="27.5" y1="19.4" y2="19.4"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="36.4" x2="42.5" y1="19.4" y2="19.4"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="21.9" x2="41.9" y1="36.4" y2="36.4"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="23.5" x2="40.2" y1="32.1" y2="32.1"/></g></svg>`

const styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%"
};

const ERROR = {
  NOT_SUPPORTED_EXTENSION: 'NOT_SUPPORTED_EXTENSION',
  FILESIZE_TOO_LARGE: 'FILESIZE_TOO_LARGE'
}

class ReactImageUploadComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pictures: [...props.defaultImages],
      files: [],
      fileErrors: []
    };
    this.inputElement = '';
    this.onDropFile = this.onDropFile.bind(this);
    this.onUploadClick = this.onUploadClick.bind(this);
    this.triggerFileUpload = this.triggerFileUpload.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(prevState.files !== this.state.files){
      this.props.onChange(this.state.files, this.state.pictures);
    }
  }

  /*
   Load image at the beggining if defaultImage prop exists
   */
  componentWillReceiveProps(nextProps){
    if(nextProps.defaultImages !== this.props.defaultImages){
      this.setState({pictures: nextProps.defaultImages});
    }
  }

  /*
	 Check file extension (onDropFile)
	 */
  hasExtension(fileName) {
    const pattern = '(' + this.props.imgExtension.join('|').replace(/\./g, '\\.') + ')$';
    return new RegExp(pattern, 'i').test(fileName);
  }

  /*
   Handle file validation
   */
  onDropFile(e) {
    const files = e.target.files;
    const allFilePromises = [];
    const fileErrors = [];

    // Iterate over all uploaded files
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      let fileError = {
        name: file.name,
      };
      // Check for file extension
      if (!this.hasExtension(file.name)) {
        fileError = Object.assign(fileError, {
          type: ERROR.NOT_SUPPORTED_EXTENSION
        });
        fileErrors.push(fileError);
        continue;
      }
      // Check for file size
      if(file.size > this.props.maxFileSize) {
        fileError = Object.assign(fileError, {
          type: ERROR.FILESIZE_TOO_LARGE
        });
        fileErrors.push(fileError);
        continue;
      }

      allFilePromises.push(this.readFile(file));
    }

    this.setState({
      fileErrors
    });

    const {singleImage} = this.props;

    Promise.all(allFilePromises).then(newFilesData => {
      const dataURLs = singleImage?[]:this.state.pictures.slice();
      const files = singleImage?[]:this.state.files.slice();

      newFilesData.forEach(newFileData => {
        dataURLs.push(newFileData.dataURL);
        files.push(newFileData.file);
      });

      this.setState({pictures: dataURLs, files: files});
    });
  }

  onUploadClick(e) {
    // Fixes https://github.com/JakeHartnell/react-images-upload/issues/55
    e.target.value = null;
  }

  /*
     Read a file and return a promise that when resolved gives the file itself and the data URL
   */
  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      // Read the image via FileReader API and save image result in state.
      reader.onload = function (e) {
        // Add the file name to the data URL
        let dataURL = e.target.result;
        dataURL = dataURL.replace(";base64", `;name=${file.name};base64`);
        resolve({file, dataURL});
      };

      reader.readAsDataURL(file);
    });
  }

  /*
   Remove the image from state
   */
  removeImage(picture) {
    const removeIndex = this.state.pictures.findIndex(e => e === picture);
    const filteredPictures = this.state.pictures.filter((e, index) => index !== removeIndex);
    const filteredFiles = this.state.files.filter((e, index) => index !== removeIndex);

    this.setState({pictures: filteredPictures, files: filteredFiles}, () => {
      this.props.onChange(this.state.files, this.state.pictures);
    });
  }

  /*
   Check if any errors && render
   */
  renderErrors() {
    const { fileErrors } = this.state;
    return fileErrors.map((fileError, index) => {
      return (
        <div className={'errorMessage ' + this.props.errorClass} key={index} style={this.props.errorStyle}>
          * {fileError.name} {fileError.type === ERROR.FILESIZE_TOO_LARGE ? this.props.fileSizeError: this.props.fileTypeError}
        </div>
      );
    });
  }

  /*
   Render the upload icon
   */
  renderIcon() {
    if (this.props.withIcon) {
      return <img src={UploadIcon} className="uploadIcon"	alt="Upload Icon" />;
    }
  }

  /*
   Render label
   */
  renderLabel() {
    if (this.props.withLabel) {
      return <p className={this.props.labelClass} style={this.props.labelStyles}>{this.props.label}</p>
    }
  }

  /*
   Render preview images
   */
  renderPreview() {
    return (
      <div className="uploadPicturesWrapper">
        <FlipMove enterAnimation="fade" leaveAnimation="fade" style={styles}>
          {this.renderPreviewPictures()}
        </FlipMove>
      </div>
    );
  }

  renderPreviewPictures() {
    return this.state.pictures.map((picture, index) => {
      return (
        <div key={index} className="uploadPictureContainer">
          <div className="deleteImage" onClick={() => this.removeImage(picture)}>X</div>
          <img src={picture} className="uploadPicture" alt="preview"/>
        </div>
      );
    });
  }

  /*
   On button click, trigger input file to open
   */
  triggerFileUpload() {
    this.inputElement.click();
  }

  clearPictures() {
    this.setState({pictures: []})
  }

  render() {
    return (
      <div className={"fileUploader " + this.props.className} style={this.props.style}>
        <div className="fileContainer" style={this.props.fileContainerStyle}>
          {this.renderIcon()}
          {this.renderLabel()}
          <div className="errorsContainer">
            {this.renderErrors()}
          </div>
          <button
            type={this.props.buttonType}
            className={"chooseFileButton " + this.props.buttonClassName}
            style={this.props.buttonStyles}
            onClick={this.triggerFileUpload}
          >
            {this.props.buttonText}
          </button>
          <input
            type="file"
            ref={input => this.inputElement = input}
            name={this.props.name}
            multiple={!this.props.singleImage}
            onChange={this.onDropFile}
            onClick={this.onUploadClick}
            accept={this.props.accept}
          />
          { this.props.withPreview ? this.renderPreview() : null }
        </div>
      </div>
    )
  }
}

ReactImageUploadComponent.defaultProps = {
  className: '',
  fileContainerStyle: {},
  buttonClassName: "",
  buttonStyles: {},
  withPreview: false,
  accept: "image/*",
  name: "",
  withIcon: true,
  buttonText: "Choose images",
  buttonType: "button",
  withLabel: true,
  label: "Max file size: 5mb, accepted: jpg|gif|png",
  labelStyles: {},
  labelClass: "",
  imgExtension: ['.jpg', '.jpeg', '.gif', '.png'],
  maxFileSize: 5242880,
  fileSizeError: " file size is too big",
  fileTypeError: " is not a supported file extension",
  errorClass: "",
  style: {},
  errorStyle: {},
  singleImage: false,
  onChange: () => {},
  defaultImages: []
};

ReactImageUploadComponent.propTypes = {
  style: PropTypes.object,
  fileContainerStyle: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  buttonClassName: PropTypes.string,
  buttonStyles: PropTypes.object,
  buttonType: PropTypes.string,
  withPreview: PropTypes.bool,
  accept: PropTypes.string,
  name: PropTypes.string,
  withIcon: PropTypes.bool,
  buttonText: PropTypes.string,
  withLabel: PropTypes.bool,
  label: PropTypes.string,
  labelStyles: PropTypes.object,
  labelClass: PropTypes.string,
  imgExtension: PropTypes.array,
  maxFileSize: PropTypes.number,
  fileSizeError: PropTypes.string,
  fileTypeError: PropTypes.string,
  errorClass: PropTypes.string,
  errorStyle: PropTypes.object,
  singleImage: PropTypes.bool,
  defaultImages: PropTypes.array
};

export default ReactImageUploadComponent;
