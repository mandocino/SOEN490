import React, { useEffect , useState} from "react";
import BaseLayout from "../components/BaseLayout";
import ImgWithText from "../components/custom/ImgWithText";
import DashboardCard from "../components/DashboardCard";
import axios from "axios";



export default function Dashboard() {

  const [locations, getLocations] = useState('');

  const fetchLocations = () => {
    const user_id = localStorage.getItem("user_id");
    axios.get(`http://localhost:5000/locations/${user_id}`)
    .then((response) => {
      getLocations(response.data);
    })
    .catch(err => console.error(err));
  }
  
  useEffect(() => {
    fetchLocations();
  }, []);

  console.log(locations);

  return (
    <>
      <BaseLayout>
      <div class="w-full flex flex-col items-center">
        <div class="w-full max-w-screen-xl flex flex-col justify-center">
          <ImgWithText url="/src/assets/stm_bus.jpg">
            Dashboard
          </ImgWithText>
          <div class="grow flex">
            <DashboardCard></DashboardCard>
          </div>
        </div>
      </div>
      
      </BaseLayout>
      
        
    </>
  );
}
