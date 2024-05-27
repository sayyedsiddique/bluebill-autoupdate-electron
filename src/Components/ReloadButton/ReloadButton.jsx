import "./ReloadButton.css";
import CachedIcon from "@mui/icons-material/Cached";

const ReloadButton = (props) => {
  // console.log("props?.isReloading ", props?.isReloading);

  return (
    <div className="relaod-btn">
      <CachedIcon
        className={props?.isReloading ? "spin" : ""}
        style={{
          color: "var(--text-color)",
          cursor: "pointer",
        }}
        onClick={props?.reloadHandler}
      />
    </div>
  );
};

export default ReloadButton;
