import React, { Component } from "react";
import { DropzoneArea } from "material-ui-dropzone";

class Dropzone extends Component {
  render() {
    return (
      <DropzoneArea
        dropzoneClass={this.props.className}
        dropzoneParagraphClass={this.props.paragraphClassName}
        onDrop={this.props.handleFileUpload}
        dropzoneText={
          this.props.files.length === 0 ? (
            <>{this.props.dropzoneParagraph}</>
          ) : (
            "Document uploaded"
          )
        }
        acceptedFiles={this.props.acceptedFiles}
        filesLimit={1}
        onDelete={this.props.handleDeleteFile}
        maxFileSize={5000000000}
        showPreviewsInDropzone={true}
        showFileNamesInPreview={true}
        showPreviews={false}
        showFileNames={true}
        useChipsForPreview={true}
      />
    );
  }
}

export default Dropzone;
