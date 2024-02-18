// import BubbleChart from "./BubbleChart";
import * as _ from "lodash";
import { useEffect, useState } from "react";
import {
  trialIndex,
  ballAQty,
  missHistory,
} from "../../../slices/pretaskSlice";
import { useSelector } from "react-redux";

const blue = '#6495ED';
const green = '#50C878'

export default function Jar() {

  const trialIndexS = useSelector(trialIndex);
  const ballAQtyS = useSelector(ballAQty);
  const missHistoryS = useSelector(missHistory);
  const ballA = ballAQtyS[trialIndexS];
  const totalQty = 100;
  const [data, setData] = useState([]);

  const getData = () => _.shuffle([
    ...Array.from({ length: ballA }).fill({
      rad: 0.2,
      type: 'a',
    }),
    ...Array.from({ length: totalQty - ballA }).fill({
      rad: 0.2,
      type: 'b',
    }),
  ]);


  useEffect(() => {
    if (trialIndexS === 0 || data.length === 0) {
      setData(getData());
    }
    else if (trialIndexS === missHistoryS.length) {
      if (!missHistoryS[missHistoryS.length - 1]) {
        setData(getData());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ballAQtyS, trialIndexS, missHistoryS])

  return (
    <>
      <div style={{
        height: '330px',
        width: '305px',
        margin: 'auto',
        border: '3px solid #000',
        borderTop: 'none',
        display: 'flex',
        alignItems: 'end',
      }}>
        <div style={{
          height: '300px',
          width: '305px',
          display: 'flex',
          padding: '8px',
          flexWrap: 'wrap-reverse',
          flexDirection: 'row',
          alignItems: 'end',
          justifyContent: 'center'
        }}>
          {data.map((ball, i) => {
            return <div
              key={i}
              style={{
                width: '24px',
                height: '24px',
                margin: '1px 2px',
                borderRadius: '50%',
                border: '1px #333 solid',
                backgroundColor: ball.type === 'a' ? blue : green,
                position: 'relative',
                // top: `${Math.round(Math.random() * 4) - 2}px`,
                // bottom: `${Math.round(Math.random() * 4) - 2}px`,
                // left: `${Math.round(Math.random() * 4) - 2}px`,
                // right: `${Math.round(Math.random() * 4) - 2}px`,
              }}></div>
          })}
        </div>
      </div>
    </>
  );
}
