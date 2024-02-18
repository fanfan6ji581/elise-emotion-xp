import Pretask from "./Pretask";
import TrainingTimer from "../trial/TrainingTimer"
import {
  removeData,
} from "../../../slices/pretaskSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { getPretask } from "../../../database/pretask";
import { useEffect, useState } from "react";

const PretaskPage = () => {
  const { alias } = useParams()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pretask, setPretask] = useState(null);
  const onFinish = () => {
    dispatch(removeData());
    navigate(`/xp/${alias}/pretask/start`);
  }

  const fetchPretask = async () => {
    const pretask = await getPretask(alias);
    setPretask(pretask);
  }

  useEffect(() => {
    fetchPretask();

    return () => {
      dispatch(removeData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Pretask isTraining={true} />
      {pretask &&
        <TrainingTimer trainingSessionSeconds={pretask.trainingSessionSeconds} onFinish={onFinish} />
      }
    </>
  );
};

export default PretaskPage;
