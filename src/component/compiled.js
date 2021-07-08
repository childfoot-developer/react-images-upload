'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactFlipMove = require('react-flip-move');

var _reactFlipMove2 = _interopRequireDefault(_reactFlipMove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UploadIcon = '<svg enable-background="new 0 0 64 64" height="64px" id="Layer_1" version="1.1" viewBox="0 0 64 64" width="64px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="   M10,41.3v12c0,1.1,0.9,2,2,2h40c1.1,0,2-0.9,2-2v-12H10z" fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><path d="   M42.6,19.4c3.8,7.3,7.6,14.7,11.4,22c-14.7,0-29.3,0-44,0c3.8-7.3,7.6-14.7,11.4-22" fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"/><g><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="32" x2="32" y1="8.7" y2="28.2"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="32" x2="35.7" y1="8.7" y2="12.4"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="28" x2="31.7" y1="12.4" y2="8.7"/></g><circle cx="47.3" cy="46.7" fill="none" r="2.3" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="21.4" x2="27.5" y1="19.4" y2="19.4"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="36.4" x2="42.5" y1="19.4" y2="19.4"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="21.9" x2="41.9" y1="36.4" y2="36.4"/><line fill="none" stroke="#4D4D4D" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" x1="23.5" x2="40.2" y1="32.1" y2="32.1"/></g></svg>';

var styles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  width: "100%"
};

var ERROR = {
  NOT_SUPPORTED_EXTENSION: 'NOT_SUPPORTED_EXTENSION',
  FILESIZE_TOO_LARGE: 'FILESIZE_TOO_LARGE'
};

var ReactImageUploadComponent = function (_React$Component) {
  _inherits(ReactImageUploadComponent, _React$Component);

  function ReactImageUploadComponent(props) {
    _classCallCheck(this, ReactImageUploadComponent);

    var _this = _possibleConstructorReturn(this, (ReactImageUploadComponent.__proto__ || Object.getPrototypeOf(ReactImageUploadComponent)).call(this, props));

    _this.state = {
      pictures: [].concat(_toConsumableArray(props.defaultImages)),
      files: [],
      fileErrors: []
    };
    _this.inputElement = '';
    _this.onDropFile = _this.onDropFile.bind(_this);
    _this.onUploadClick = _this.onUploadClick.bind(_this);
    _this.triggerFileUpload = _this.triggerFileUpload.bind(_this);
    return _this;
  }

  _createClass(ReactImageUploadComponent, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      if (prevState.files !== this.state.files) {
        this.props.onChange(this.state.files, this.state.pictures);
      }
    }

    /*
     Load image at the beggining if defaultImage prop exists
     */

  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.defaultImages !== this.props.defaultImages) {
        this.setState({ pictures: nextProps.defaultImages });
      }
    }

    /*
    Check file extension (onDropFile)
    */

  }, {
    key: 'hasExtension',
    value: function hasExtension(fileName) {
      var pattern = '(' + this.props.imgExtension.join('|').replace(/\./g, '\\.') + ')$';
      return new RegExp(pattern, 'i').test(fileName);
    }

    /*
     Handle file validation
     */

  }, {
    key: 'onDropFile',
    value: function onDropFile(e) {
      var _this2 = this;

      var files = e.target.files;
      var allFilePromises = [];
      var fileErrors = [];

      // Iterate over all uploaded files
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var fileError = {
          name: file.name
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
        if (file.size > this.props.maxFileSize) {
          fileError = Object.assign(fileError, {
            type: ERROR.FILESIZE_TOO_LARGE
          });
          fileErrors.push(fileError);
          continue;
        }

        allFilePromises.push(this.readFile(file));
      }

      this.setState({
        fileErrors: fileErrors
      });

      var singleImage = this.props.singleImage;


      Promise.all(allFilePromises).then(function (newFilesData) {
        var dataURLs = singleImage ? [] : _this2.state.pictures.slice();
        var files = singleImage ? [] : _this2.state.files.slice();

        newFilesData.forEach(function (newFileData) {
          dataURLs.push(newFileData.dataURL);
          files.push(newFileData.file);
        });

        _this2.setState({ pictures: dataURLs, files: files });
      });
    }
  }, {
    key: 'onUploadClick',
    value: function onUploadClick(e) {
      // Fixes https://github.com/JakeHartnell/react-images-upload/issues/55
      e.target.value = null;
    }

    /*
       Read a file and return a promise that when resolved gives the file itself and the data URL
     */

  }, {
    key: 'readFile',
    value: function readFile(file) {
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();

        // Read the image via FileReader API and save image result in state.
        reader.onload = function (e) {
          // Add the file name to the data URL
          var dataURL = e.target.result;
          dataURL = dataURL.replace(";base64", ';name=' + file.name + ';base64');
          resolve({ file: file, dataURL: dataURL });
        };

        reader.readAsDataURL(file);
      });
    }

    /*
     Remove the image from state
     */

  }, {
    key: 'removeImage',
    value: function removeImage(picture) {
      var _this3 = this;

      var removeIndex = this.state.pictures.findIndex(function (e) {
        return e === picture;
      });
      var filteredPictures = this.state.pictures.filter(function (e, index) {
        return index !== removeIndex;
      });
      var filteredFiles = this.state.files.filter(function (e, index) {
        return index !== removeIndex;
      });

      this.setState({ pictures: filteredPictures, files: filteredFiles }, function () {
        _this3.props.onChange(_this3.state.files, _this3.state.pictures);
      });
    }

    /*
     Check if any errors && render
     */

  }, {
    key: 'renderErrors',
    value: function renderErrors() {
      var _this4 = this;

      var fileErrors = this.state.fileErrors;

      return fileErrors.map(function (fileError, index) {
        return _react2.default.createElement(
          'div',
          { className: 'errorMessage ' + _this4.props.errorClass, key: index, style: _this4.props.errorStyle },
          '* ',
          fileError.name,
          ' ',
          fileError.type === ERROR.FILESIZE_TOO_LARGE ? _this4.props.fileSizeError : _this4.props.fileTypeError
        );
      });
    }

    /*
     Render the upload icon
     */

  }, {
    key: 'renderIcon',
    value: function renderIcon() {
      if (this.props.withIcon) {
        return _react2.default.createElement('img', { src: UploadIcon, className: 'uploadIcon', alt: 'Upload Icon' });
      }
    }

    /*
     Render label
     */

  }, {
    key: 'renderLabel',
    value: function renderLabel() {
      if (this.props.withLabel) {
        return _react2.default.createElement(
          'p',
          { className: this.props.labelClass, style: this.props.labelStyles },
          this.props.label
        );
      }
    }

    /*
     Render preview images
     */

  }, {
    key: 'renderPreview',
    value: function renderPreview() {
      return _react2.default.createElement(
        'div',
        { className: 'uploadPicturesWrapper' },
        _react2.default.createElement(
          _reactFlipMove2.default,
          { enterAnimation: 'fade', leaveAnimation: 'fade', style: styles },
          this.renderPreviewPictures()
        )
      );
    }
  }, {
    key: 'renderPreviewPictures',
    value: function renderPreviewPictures() {
      var _this5 = this;

      return this.state.pictures.map(function (picture, index) {
        return _react2.default.createElement(
          'div',
          { key: index, className: 'uploadPictureContainer' },
          _react2.default.createElement(
            'div',
            { className: 'deleteImage', onClick: function onClick() {
                return _this5.removeImage(picture);
              } },
            'X'
          ),
          _react2.default.createElement('img', { src: picture, className: 'uploadPicture', alt: 'preview' })
        );
      });
    }

    /*
     On button click, trigger input file to open
     */

  }, {
    key: 'triggerFileUpload',
    value: function triggerFileUpload() {
      this.inputElement.click();
    }
  }, {
    key: 'clearPictures',
    value: function clearPictures() {
      this.setState({ pictures: [] });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      return _react2.default.createElement(
        'div',
        { className: "fileUploader " + this.props.className, style: this.props.style },
        _react2.default.createElement(
          'div',
          { className: 'fileContainer', style: this.props.fileContainerStyle },
          this.renderLabel(),
          _react2.default.createElement(
            'div',
            { className: 'errorsContainer' },
            this.renderErrors()
          ),
          _react2.default.createElement(
            'button',
            {
              type: this.props.buttonType,
              className: "chooseFileButton " + this.props.buttonClassName,
              style: this.props.buttonStyles,
              onClick: this.triggerFileUpload
            },
            this.props.buttonText
          ),
          _react2.default.createElement('input', {
            type: 'file',
            ref: function ref(input) {
              return _this6.inputElement = input;
            },
            name: this.props.name,
            multiple: !this.props.singleImage,
            onChange: this.onDropFile,
            onClick: this.onUploadClick,
            accept: this.props.accept
          }),
          this.props.withPreview ? this.renderPreview() : null
        )
      );
    }
  }]);

  return ReactImageUploadComponent;
}(_react2.default.Component);

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
  onChange: function onChange() {},
  defaultImages: []
};

ReactImageUploadComponent.propTypes = {
  style: _propTypes2.default.object,
  fileContainerStyle: _propTypes2.default.object,
  className: _propTypes2.default.string,
  onChange: _propTypes2.default.func,
  onDelete: _propTypes2.default.func,
  buttonClassName: _propTypes2.default.string,
  buttonStyles: _propTypes2.default.object,
  buttonType: _propTypes2.default.string,
  withPreview: _propTypes2.default.bool,
  accept: _propTypes2.default.string,
  name: _propTypes2.default.string,
  withIcon: _propTypes2.default.bool,
  buttonText: _propTypes2.default.string,
  withLabel: _propTypes2.default.bool,
  label: _propTypes2.default.string,
  labelStyles: _propTypes2.default.object,
  labelClass: _propTypes2.default.string,
  imgExtension: _propTypes2.default.array,
  maxFileSize: _propTypes2.default.number,
  fileSizeError: _propTypes2.default.string,
  fileTypeError: _propTypes2.default.string,
  errorClass: _propTypes2.default.string,
  errorStyle: _propTypes2.default.object,
  singleImage: _propTypes2.default.bool,
  defaultImages: _propTypes2.default.array
};

exports.default = ReactImageUploadComponent;
