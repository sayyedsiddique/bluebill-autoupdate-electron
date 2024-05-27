import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
// import { ReactComponent as UploadIcon } from "../../assets/images/svg/upload.svg";
// import { ReactComponent as CloseIcone } from "../../assets/images/svg/close.svg";
import { MdOutlineFileUpload } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import "./DragAndDropPureHtml.css";

let classes = "dropzone";
const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

const previewStyle = {
  display: "block",
  maxWidth: "260px",
  maxHeight: "100px",
  height: "100px",
  objectFit: "scale-down",
};
const errors = {
  FILESIZE: "More than 2MB in size",
  FILETYPE: "Not an image file",
};

const DragAndDropPureHtml = (props) => {
  const {
    files,
    setFiles,
    editProductImgs,
    setEditProductImgs,
    uploadImageHandler,
  } = props;
  console.log("files... ", files);
  const [fileErrors, setFileErrors] = useState("");
  console.log("fileErrors... ", fileErrors);
  const [isDragActive, setIsDragActive] = useState("");
  const [isDragAccept, setIsDragAccept] = useState("");
  const [isDragReject, setIsDragReject] = useState("");
  const MAX_SIZE = 2097152;
  const fileInput = document.getElementById("fileInput");
  let showText = files?.length === 0;
  const additionalClass = isDragAccept
    ? `${classes} accept`
    : isDragReject
    ? `${classes} reject`
    : isDragActive
    ? `${classes} active`
    : classes;

  //   it's run when someone try to drap something on dropbox
  const dragOverHandler = (e) => {
    e.preventDefault();
    setIsDragActive(true);
    console.log("Dragging");
  };

  const dragLeaveHandler = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  // remove the image from dropbox
  const closeHandler = () => {
    setFiles([]);
    setFileErrors([]);
  };

  //   it's handled drap and drop event
  const dragDropHandler = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    // checking file type is correct or not
    if (
      files?.length &&
      Array.from(files).some((item) => allowedTypes.includes(item.type))
    ) {
      setIsDragActive(false);
      // checking the image size
      if (files[0].size > MAX_SIZE) {
        setFileErrors(`file-too-large`);
        setFiles([]); // Clear the file input
        return;
      } else {
        setFiles(Array.from(files));
        fileInput.files = files;
        // uploadImageHandler(e);
      }
    } else {
      setFileErrors("file-invalid-type");
    }
  };

  // when user click on drag and drop box image select section open by this handler
  const browseBtnHandler = () => {
    fileInput?.click();
  };

  //   file input handler to get file from input
  const imageOnChangeHandler = (e) => {
    setEditProductImgs("")
    const files = e.target.files;
    console.log("files...", Array.from(files));

    // checking file type is correct or not
    if (
      files?.length &&
      Array.from(files).some((item) => allowedTypes.includes(item.type))
    ) {
      // checking the image size
      if (files[0].size > MAX_SIZE) {
        setFileErrors(`file-too-large`);
        setFiles && setFiles([]); // Clear the file input
        return;
      } else {
        files && setFiles(Array.from(files));
        // uploadImageHandler(e);
      }
    } else {
      setFileErrors("file-invalid-type");
    }
  };

  const getErrorMessage = () => {
    switch (fileErrors) {
      case "file-invalid-type":
        return (
          <p
            className={"text-error text-danger"}
          >{`File is not a valid JPG, JPEG, or PNG file.`}</p>
        );
      case "file-too-large":
        return (
          <p className={"text-error text-danger"}>
            Exceeds the maximum size of 2MB.
          </p>
        );
      default:
        return <p className={"text-error text-danger"}>File error</p>;
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center gap-2 w-100 ">
      {/* for displaying image path with name */}
      {files?.length > 0 ? (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
        >
          <span className="font-14">{files[0]?.name}</span>
          <AiOutlineClose onClick={closeHandler} />
        </div>
      ) : null}

      <div className="d-flex">
        <div
          className={`${additionalClass}`}
          onDragOver={dragOverHandler}
          onDragLeave={dragLeaveHandler}
          onDrop={(e) => dragDropHandler(e)}
          onClick={browseBtnHandler}
        >
          <input
            id="fileInput"
            type="file"
            onChange={imageOnChangeHandler}
            accept=".jpg, .jpeg, .png"
          />
          {isDragActive ? (
            isDragReject ? (
              <p className="my-4 py-2">Not an image file</p>
            ) : (
              <p className="my-4 py-2">Drop file here ...</p>
            )
          ) : (
            !editProductImgs && showText &&
            (fileErrors?.length > 0 ? (
              getErrorMessage()
            ) : (
              <div className="browseBtn d-flex fit-content align-items-center text-wrap bg-white shadow-sm rounded-3 px-2 py-2 my-4 cursor gap-2 ">
                <MdOutlineFileUpload />
                <span>Click or drop image</span>
              </div>
            ))
          )}
          {files &&
            files?.map((file, i) => (
              <div key={i}>
                {console.log("file?.path... ", URL.createObjectURL(file))}
                <img
                  className="m-1 dragDrop-img"
                  alt="Preview"
                  key={file?.path}
                  src={URL.createObjectURL(file)}
                  style={previewStyle}
                />
              </div>
            ))}
          {editProductImgs && (
            <img
              className="m-1 dragDrop-img"
              alt="Preview"
              // key={file?.path}
              src={editProductImgs}
              style={previewStyle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DragAndDropPureHtml;
