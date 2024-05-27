import * as React from "react";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFloorPlanByTableId } from "../../Redux/FloorPlan/floorPlanSlice";

const MovableSelecto = ({
  selectedTables,
  setSelectedTables,
  movableValues,
  resetHandler,
}) => {
  const dispatch = useDispatch()
  const floorPlanTablesApi = window.floorPlanTablesApi;

  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [targets, setTargets] = React.useState([]);
  console.log("selectedTables... ", selectedTables);
  const moveableRef = React.useRef(null);
  const selectoRef = useRef(null);

  // Drag handler for movable container
  const dragHandler = (e) => {
    console.log(e);
    console.log(e);
    const index = e?.target?.attributes?.name?.value;
    let arr = [...selectedTables];

    // adding dragable value in table object for further referrences
    let newObj = {
      ...arr[index],
      transform: e?.transform,
      width: e?.width,
      height: e?.height,
      borderRadius: arr[Number(index)]?.borderRadius, // previous borderRadius adding here
    };
    arr[index] = newObj;
    setSelectedTables(arr);
    localStorage.setItem("floorPlanTables", JSON.stringify(arr));
  };

  // Updating table element properties in sqlite database
  const updateFlooPlanDetails = (e) => {
    // console.log("EEE... ", e);
    // console.log("EEEL... ", e?.lastEvent);
    const index = e?.lastEvent?.target?.attributes?.name?.value;
    let arr = [...selectedTables];
    // console.log("borderRadius... ", arr[Number(index)]?.borderRadius);

    if (e?.lastEvent !== undefined) {
      const floorPlanPayload = {
        ...arr[Number(index)],
        transform: e?.lastEvent?.transform,
        width: e?.lastEvent?.width,
        height: e?.lastEvent?.height,
        borderRadius: arr[Number(index)]?.borderRadius
          ? arr[Number(index)]?.borderRadius
          : "", // previous borderRadius adding here
      };

      if(isOnline){
        dispatch(updateFloorPlanByTableId(floorPlanPayload))
      }else{
        const updatedFloorPlanTable =
        e?.lastEvent !== undefined &&
        floorPlanTablesApi?.floorPlanTablesDB?.updateFloorPlanTableById(
          floorPlanPayload
        );
      }
    }
  };

  // Roundable handler for movable container
  const roundHandler = ({ target, borderRadius }) => {
    const index = target?.attributes?.name?.value;
    let arr = [...selectedTables];

    // adding resizable value in table object for further referrences
    let newObj = { ...arr[index], borderRadius };
    arr[index] = newObj;
    setSelectedTables(arr);
    localStorage.setItem("floorPlanTables", JSON.stringify(arr));
  };

  // Updating table element properties in sqlite database
  const updateRoundFloorPlan = (e) => {
    // console.log("EEE... ", e);
    // console.log("EEEL... ", e?.lastEvent);
    const index = e?.lastEvent?.target?.attributes?.name?.value;

    let arr = [...selectedTables];

    if (e?.lastEvent !== undefined) {
      const floorPlanPayload = {
        ...arr[Number(index)],
        // transform: e?.lastEvent?.transform,
        // width: e?.lastEvent?.width,
        // height: e?.lastEvent?.height,
        borderRadius: e?.lastEvent?.borderRadius,
      };

      if(isOnline){
        dispatch(updateFloorPlanByTableId(floorPlanPayload))
      }else{
        const updatedFloorPlanTable =
        e?.lastEvent !== undefined &&
        floorPlanTablesApi?.floorPlanTablesDB?.updateFloorPlanTableById(
          floorPlanPayload
        );
      }
 
    }
  };

  return (
    <div className="root">
      <div className="container">
        <Moveable
          ref={moveableRef}
          target={targets}
          draggable={true}
          rotatable={true}
          pinchable={true}
          origin={false}
          scalable={movableValues?.scalable}
          resizable={movableValues?.resizable}
          warpable={movableValues?.warpable}
          roundable={true}
          roundPadding={15}
          onClickGroup={(e) => {
            selectoRef.current?.clickTarget(e.inputEvent, e.inputTarget);
          }}
          onDrag={(e) => {
            dragHandler(e);
            e.target.style.transform = e.transform;
          }}
          onResize={(e) => {
            dragHandler(e);
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
          }}
          onRotate={(e) => {
            dragHandler(e);
            e.target.style.transform = e.drag.transform;
          }}
          onRound={(e) => {
            roundHandler(e);
            console.log("e...", e);
          }}
          onRender={(e) => {
            e.target.style.cssText += e.cssText;
          }}
          onRenderEnd={(e) => {
            e.target.style.cssText += e.cssText;
          }}
          onDragEnd={(e) => updateFlooPlanDetails(e)}
          onResizeEnd={(e) => updateFlooPlanDetails(e)}
          onRoundEnd={(e) => updateRoundFloorPlan(e)}
        ></Moveable>
        <Selecto
          ref={selectoRef}
          dragContainer={window}
          selectableTargets={[".selecto-area .cube"]}
          hitRate={0}
          selectByClick={true}
          selectFromInside={false}
          toggleContinueSelect={["shift"]}
          ratio={0}
          onDragStart={(e) => {
            const moveable = moveableRef.current;
            const target = e.inputEvent.target;
            if (
              moveable.isMoveableElement(target) ||
              targets.some((t) => t === target || t.contains(target))
            ) {
              e.stop();
            }
          }}
          onSelectEnd={(e) => {
            const moveable = moveableRef.current;
            if (e.isDragStart) {
              e.inputEvent.preventDefault();

              moveable.waitToChangeTarget().then(() => {
                moveable.dragStart(e.inputEvent);
              });
            }
            setTargets(e.selected);
          }}
        ></Selecto>

        <div className="elements selecto-area d-flex">
          {selectedTables.length > 0 &&
            selectedTables?.map((item, i) => {
              return (
                <div
                  className="cube"
                  key={i}
                  name={i}
                  id={i}
                  style={{
                    transform: item?.transform ? item?.transform : "",
                    width: item?.width ? item?.width : "",
                    height: item?.height ? item?.height : "",
                    borderRadius: item?.borderRadius ? item?.borderRadius : "",
                  }}
                >
                  <span>{item?.tableName}</span>
                </div>
              );
            })}
        </div>
        <div className="empty elements"></div>
      </div>
    </div>
  );
};

export default MovableSelecto;
