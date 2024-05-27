import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
// import { ReactComponent as UploadIcon } from "../../assets/images/svg/upload.svg";
// import { ReactComponent as CloseIcone } from "../../assets/images/svg/close.svg"
import DocumentImgae from '../../assets/images/document.png'
import { MdOutlineFileUpload } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

const DragandDropExcel = (props) => {
  const { files, setFiles, fileType,setfileErr } = props;
  const [fileErrors, setfileErrors] = useState([]);
  const MAX_SIZE = 2097152;
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
      accept: {
      //   fileType ? fileType : [
      //   // 'application/pdf',
      //   // 'application/msword',
      //   // '.doc,.docx,.csv,.tsv,.odt,.rtf.xlsx',
      //   // 'application/vnd.ms-word.document.macroEnabled.12',
      //   '.xlsx'
      // ],
      'image/xlsx': ['.xlsx']
    },
    maxSize: MAX_SIZE,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      setfileErr("")
      setfileErrors(rejectedFiles.length > 0 ? rejectedFiles[0].errors : []);
      showText = files.length === 0;
    },
    onDragEnter: () => {
      setFiles([]);
      setfileErrors([]);
    },
  });
  let classes = "dropzone";
  let showText = files.length === 0;

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
    revokeDataUri(files);
    setFiles([]);
    setfileErrors([]);
    // alert("This will remove image preview and logo from farm");
  };


  const errors = {
    FILESIZE: "More than 2MB in size",
    FILETYPE: "Not an file",
  };

  const getErrorMessage = () => {
    switch (fileErrors[0].code) {
      case "file-invalid-type":
        return <p className={"text-danger mb-0"}>{errors.FILETYPE}</p>;
      case "file-too-large":
        return <p className={"text-error"}>{errors.FILESIZE}</p>;
      default:
        return <p className={"text-error"}>File error</p>;
    }
  };
  return (
    <div className="d-flex flex-column justify-content-center gap-2 w-100">
      {files.length > 0 ?
        <div className="d-flex justify-content-between align-items-center">
           <span className="font-14">{files[0]?.path}</span>
          <AiOutlineClose onClick={onClickHandler} style={{cursor: "pointer"}} />
        </div> : null}

      <div className="d-flex">

        <div {...getRootProps({ className: `${additionalClass}` })}>

          <input {...getInputProps()} />
          {isDragActive ? (
            isDragReject ? (
              <p className="my-4 py-2">Not an doc file</p>
            ) : (
              <p className="my-4 py-2">Drop file here ...</p>
            )
          ) : (
            showText &&
            (fileErrors.length > 0 ? (
              getErrorMessage()
            ) : (
              <div className="d-flex fit-content align-items-center text-wrap bg-white shadow-sm rounded-3 px-2 py-2 my-4 cursor gap-2 ">
                <MdOutlineFileUpload />
                <span>Click or drop file</span>
              </div>
            ))
          )}
          {files.map((file, i) => (
            <div key={i}>
              <img
                alt="Preview"
                key={DocumentImgae}
                src={DocumentImgae}
                style={previewStyle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default DragandDropExcel