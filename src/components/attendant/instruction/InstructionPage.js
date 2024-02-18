import { useParams } from "react-router-dom";
import { setXpConfig } from "../../../slices/gameSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { useEffect } from "react";
import { getXp } from "../../../database/xp";

const InstructionPage = () => {
  const { alias } = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchXP = async () => {
      const xpConfig = await getXp(alias)
      dispatch(setXpConfig(xpConfig));
      if (xpConfig) {
        switch (xpConfig.treatment) {
          case 3:
            return navigate(`/xp/${alias}/instruction3`)
          case 2:
            return navigate(`/xp/${alias}/instruction2`)
          case 1:
          default:
            return navigate(`/xp/${alias}/instruction1`)
        }
      }
    };

    fetchXP();
    // eslint-disable-next-line
  }, [])
};

export default InstructionPage;
