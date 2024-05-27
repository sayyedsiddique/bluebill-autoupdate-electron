import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
// import { ReactComponent as UploadIcon } from "../../assets/images/svg/upload.svg";
// import { ReactComponent as CloseIcone } from "../../assets/images/svg/close.svg";
import { MdOutlineFileUpload } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

const DragandDrop = (props) => {
  const { files, setFiles, fileType, uploadImageHandler } = props;
  const [fileErrors, setfileErrors] = useState([]);
  const MAX_SIZE = 2097152;

  const secondInput = document.querySelector("#secondImgInput");
    console.log("files... ", files);


const triggerChangeEvent = (element) => {
  let changeEvent = new Event("change")
  element.dispatchEvent(changeEvent)
}
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { "image/jpeg": [".jpeg", ".jpg ", ".png", ".gif"] },
    maxSize: MAX_SIZE,
    onDrop: (acceptedFiles, rejectedFiles, event) => {
      // const reader = new FileReader();

      // reader.onload = () => {
      //   const imageUrl = reader.result;
      //   // Perform further actions with the image URL (e.g., display in UI)
      //   console.log('Image URL:', imageUrl);
      // };

      // reader.readAsDataURL(acceptedFiles[0]); 
      setFiles(
        acceptedFiles?.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setfileErrors(rejectedFiles?.length > 0 ? rejectedFiles[0]?.errors : []);
      showText = files?.length === 0;
    },
    onDragEnter: () => {
      setFiles([]);
      setfileErrors([]);
    },
  });
  let classes = "dropzone";
  let showText = files?.length === 0;

  const additionalClass = isDragAccept
    ? `${classes} accept`
    : isDragReject
    ? `${classes} reject`
    : classes;

  const previewStyle = {
    display: "block",
    maxWidth: "260px",
    maxHeight: "100px",
    height: "100px",
    objectFit: "scale-down",
  };

  const revokeDataUri = (files) => {
    files.forEach((file) => URL.revokeObjectURL(file?.preview));
  };

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      // files.forEach((file) => URL.revokeObjectURL(file.preview));
      //revokeDataUri(files);
      // const inputValues = {...getInputProps()}
      // console.log("inputValues...", inputValues)
    },
    [files]
  );
  const onClickHandler = () => {
    // files.forEach((file) => URL.revokeObjectURL(file.preview));
    revokeDataUri(files);
    setFiles([]);
    setfileErrors([]);
    // alert("This will remove image preview and logo from farm");
  };

  const errors = {
    FILESIZE: "More than 2MB in size",
    FILETYPE: "Not an image file",
  };

  const getErrorMessage = () => {
    switch (fileErrors[0].code) {
      case "file-invalid-type":
        return <p className={"text-error text-danger"}>{errors.FILETYPE}</p>;
      case "file-too-large":
        return <p className={"text-error text-danger"}>{errors.FILESIZE}</p>;
      default:
        return <p className={"text-error text-danger"}>File error</p>;
    }
  };

  const handleRemoveFile = (i) => {
    const arr = [...files];
    arr.splice(i, 1);
    setFiles(arr);
  };



  return (
    <div className="d-flex flex-column justify-content-center gap-2 w-100">
      {files?.length > 0 ? (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ cursor: "pointer" }}
        >
          <span className="font-14">{files[0]?.name}</span>
          <AiOutlineClose onClick={onClickHandler} />
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
            showText &&
            (fileErrors?.length > 0 ? (
              getErrorMessage()
            ) : (
              <div className="d-flex fit-content align-items-center text-wrap bg-white shadow-sm rounded-3 px-2 py-2 my-4 cursor gap-2 ">
                <MdOutlineFileUpload />
                <span>Click or drop image</span>
              </div>
            ))
          )}
          {files &&
            files?.map((file, i) => (
              <div key={i}>
                {/* <div
                style={{ color: "black", padding: 15 }}
                onClick={() => handleRemoveFile(i)}
              >
                X
              </div> */}
                <img
                  className="m-1 dragDrop-img"
                  alt="Preview"
                  key={file?.preview}
                  src={file?.preview}
                  style={previewStyle}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DragandDrop;
