import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
// import { ReactComponent as UploadIcon } from "../../assets/images/svg/upload.svg";
// import { ReactComponent as CloseIcone } from "../../assets/images/svg/close.svg";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  justifyContent: "center",
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 50,
  height: 50,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
};

const img = {
  display: "block",
  width: "auto",
  height: "100%",
};

const DragandDropMultiple = (props) => {
  const { files, setFiles, fileType } = props;
  const [fileErrors, setfileErrors] = useState([]);
  const MAX_SIZE = 2097152;
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 10,
    accept: fileType ? fileType : "image/jpg, image/jpeg, image/png, image/gif",
    maxSize: MAX_SIZE,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setfileErrors(rejectedFiles.length > 0 ? rejectedFiles[0].errors : []);
      showText = files.length === 0;
    },
    onDragEnter: () => {
      setFiles([]);
      setfileErrors([]);
    },
  });
  let classes = "dropzone flex-column-reverse";
  let showText = files.length === 0;

  const additionalClass = isDragAccept
    ? `${classes} accept`
    : isDragReject
    ? `${classes} reject`
    : classes;

  const previewStyle = {
    display: "flex",
    maxWidth: "100px",
    maxHeight: "100px",
    height: "auto",
    objectFit: "scale-down",
  };

  const revokeDataUri = (files) => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  };

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      // files.forEach((file) => URL.revokeObjectURL(file.preview));
      //revokeDataUri(files);
    },
    [files]
  );
  const onClickHandler = () => {
    // files.forEach((file) => URL.revokeObjectURL(file.preview));
    // revokeDataUri(files);
    setFiles([]);
    setfileErrors([]);
    // alert("This will remove image preview and logo from farm");
  };

  const errors = {
    FILESIZE: "More than 2MB in size",
    FILETYPE: "Not an image file",
    NUMBEROFFILES: "Only 10 files are allowed",
  };
  

  const getErrorMessage = () => {
    switch (fileErrors[0].code) {
      case "file-invalid-type":
        return <p className={"text-error"}>{errors.FILETYPE}</p>;
      case "file-too-large":
        return <p className={"text-error"}>{errors.FILESIZE}</p>;
      case "File Upload limit exceeded(only 10 file are allowed)":
        return <p className={"text-error"}>{errors.NUMBEROFFILES}</p>;
      case "too-many-files":
        return <p className={"text-error"}>{errors.NUMBEROFFILES}</p>;
      default:
        return <p className={"text-error"}>File error</p>;
    }
  };
  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          key={file.preview}
          src={file.preview}
          style={img}
          alt="preview"
          // Revoke data uri after image is loaded
          // onLoad={() => {
          //   URL.revokeObjectURL(file.preview);
          // }}
        />
      </div>
    </div>
  ));
  return (
    <div className="d-flex flex-column justify-content-center gap-2 w-100">
      {files.length > 0 ? (
        <div className="d-flex justify-content-between align-items-center">
          <span className="font-14">Selected files ({files?.length})</span>
          {/* <CloseIcone onClick={onClickHandler} /> */}
        </div>
      ) : null}

      <div className="d-flex">
        <div {...getRootProps({ className: `${additionalClass}` })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            isDragReject ? (
              <p className="my-4 py-2">Not an image file</p>
            ) : (
              <p className="my-4 py-2">Drop file here ...</p>
            )
          ) : (
            showText && (fileErrors.length > 0 ? getErrorMessage() : null)  
          )}
          {/*  {files.map((file, i) => (
          <div key={i} className="d-flex flex-column fit-content text-wrap px-1 gap-1">
            <img
              alt="Preview"
              key={file.preview}
              src={file.preview}
              style={previewStyle}
            />
          </div>
        ))}*/}
          <section className="container d-flex flex-column align-items-center justify-content-center  ">
            <div>
              <input {...getInputProps()} />
              <div className="d-flex fit-content align-items-center text-wrap bg-white shadow-sm rounded-3 px-2 py-2 my-4 cursor gap-2 ">
                {/* <UploadIcon /> */}
                <span className="d-flex flex-row align-items-center">
                  Click or drop image
                </span>
              </div>
            </div>
            <aside style={thumbsContainer}>{thumbs}</aside>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DragandDropMultiple;
