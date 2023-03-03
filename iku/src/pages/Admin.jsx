import BaseLayout from "../components/BaseLayout";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {updateAlgorithmTime} from "../backend/utils/scoring";

export default function Admin() {
  const userID = localStorage.getItem("user_id");
  const [user, setUser] = useState(null);
  const [updatedTime, setUpdatedTime] = useState(null);

  const fetchUser = async() => {
    const response = await axios.get(`http://localhost:5000/userByID/${userID}`)
    setUser(response.data[0]);
  }

  const updateTime = async() => {
    const result = await updateAlgorithmTime()
    setUpdatedTime(new Date(result.lastAlgoUpdateTime).toTimeString());
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (user !== null && user.administrator) {
    return (
      <>
        <BaseLayout className="h-full flex flex-col">
          <div className="grow flex flex-col items-center justify-center font-semibold dark:text-white">
            <button
            type="button"
            onClick={updateTime}
            className="border-2 border-white mb-10 rounded	p-2"
          >
            Update algo time
          </button>
          {
            updatedTime == null ?
              <>
                <p>
                  Did not update time yet.
                </p>
              </>
              :
              <>
                <p>
                  Updated time to {updatedTime}
                </p>
              </>
          }
          </div>

        </BaseLayout>
      </>
    );
  }

  // TODO: Return 404 if user is not administrator

}