import BaseLayout from "../components/BaseLayout";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {updateRoutingAlgorithmTime, updateScoringAlgorithmTime} from "../backend/utils/scoring";
import {ConfirmDialog} from "../components/custom/ConfirmDialog";

export default function Admin() {
  const userID = localStorage.getItem("user_id");
  const [user, setUser] = useState(null);
  const [scoringAlgoUpdatedTime, setScoringAlgoUpdatedTime] = useState(null);
  const [routingAlgoUpdatedTime, setRoutingAlgoUpdatedTime] = useState(null);
  const [updateScoringAlgoConfirm, setUpdateScoringAlgoConfirm] = useState(false);
  const [updateRoutingAlgoConfirm, setUpdateRoutingAlgoConfirm] = useState(false);

  const fetchUser = async() => {
    const response = await axios.get(`http://iku.ddns.net:5000/userByID/${userID}`)
    setUser(response.data[0]);
  }

  const handleUpdateScoringAlgoTime = async() => {
    const result = await updateScoringAlgorithmTime()
    setScoringAlgoUpdatedTime(new Date(result.lastAlgoUpdateTime).toTimeString());
  }

  const handleUpdateRoutingAlgoTime = async() => {
    const result = await updateRoutingAlgorithmTime()
    setRoutingAlgoUpdatedTime(new Date(result.lastRoutingUpdateTime).toTimeString());
  }

  const updateScoringAlgoTime = () => {
    setUpdateScoringAlgoConfirm(true)
  }

  const updateRoutingAlgoTime = () => {
    setUpdateRoutingAlgoConfirm(true)
  }



  useEffect(() => {
    fetchUser();
  }, []);

  if (user !== null && user.administrator) {
    return (
      <>
        <BaseLayout className="h-full flex flex-col items-center">
            <div className="grow flex flex-col justify-center font-semibold dark:text-white gap-4">
              <div className="flex items-center gap-2 justify-start">
                <button
                  type="button"
                  onClick={updateScoringAlgoTime}
                  className="border-2 border-emerald-dark dark:border-white bg-white dark:bg-emerald-dark rounded	p-2"
                >
                  Update Scoring Algo time
                </button>
                {
                  scoringAlgoUpdatedTime == null ?
                    <>
                      <p>
                        Did not update scoring algo time yet.
                      </p>
                    </>
                    :
                    <>
                      <p>
                        Updated scoring algo time to {scoringAlgoUpdatedTime}
                      </p>
                    </>
                }
              </div>
              <div className="flex items-center gap-2 justify-start">
                <button
                  type="button"
                  onClick={updateRoutingAlgoTime}
                  className="border-2 border-emerald-dark dark:border-white bg-white dark:bg-emerald-dark rounded	p-2"
                >
                  Update Routing Algo time
                </button>
                {
                  routingAlgoUpdatedTime == null ?
                    <>
                      <p>
                        Did not update routing algo time yet.
                      </p>
                    </>
                    :
                    <>
                      <p>
                        Updated routing algo time to {routingAlgoUpdatedTime}
                      </p>
                    </>
                }
              </div>

            </div>
          <ConfirmDialog
            open={updateScoringAlgoConfirm}
            setOpen={setUpdateScoringAlgoConfirm}
            onConfirm={handleUpdateScoringAlgoTime}
          >
            Update <b>Scoring Algorithm</b> time?
          </ConfirmDialog>
          <ConfirmDialog
            open={updateRoutingAlgoConfirm}
            setOpen={setUpdateRoutingAlgoConfirm}
            onConfirm={handleUpdateRoutingAlgoTime}
          >
            Update <b>Routing Algorithm</b> time?
          </ConfirmDialog>
        </BaseLayout>
      </>
    );
  }
}