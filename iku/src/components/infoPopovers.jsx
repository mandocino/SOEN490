import Carousel from "react-material-ui-carousel";
import React from "react";


function CarouselItem(props) {
  return (
    <div className="h-72 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-emerald-darker dark:to-black rounded-xl p-2 overflow-y-auto">
      {props.children}
    </div>
  )
}

function CustomizedCarousel({children}) {
  return (
    <Carousel autoPlay={false} animation="slide" cycleNavigation={false} className="text-emerald-darker dark:text-white"
              sx={{
                button: {
                  '&:hover': {
                    opacity: '1 !important'
                  }
                },
                buttonWrapper: {
                  '&:hover': {
                    '& $button': {
                      backgroundColor: "black",
                      filter: "brightness(120%)",
                      opacity: "1"
                    }
                  }
                },
              }}>
      {children}
    </Carousel>
  )
}


export default function FactorWeightsInfo({colors}) {
 return (
   <CustomizedCarousel>
     <CarouselItem>
       <div className="mb-4">
         The two adjustable scoring factors are the <b className={colors[0].text}>frequency</b> and
         the <b className={colors[1].text}>duration</b>. Use the slider below to adjust the
         proportional impact of these factors.
       </div>

       <div className="mb-4">
         If you need explanations on what these factors mean, or guidance on how to set these scoring
         factors, click the arrows on the sides (or swipe left) to view details.
       </div>
     </CarouselItem>

     <CarouselItem>
       <div className="mb-4">
         The <b className={colors[0].text}>frequency</b> refers to the gap between departures: if the
         departures are spaced on average 15 minutes apart (such that departures are at 9:00 AM, 9:15 AM,
         etc.), then the frequency is 15. The frequency is by far regarded to be the most important
         aspect of any transit service.
       </div>

       <div className="mb-4">
         By default, the frequency represents 70% of the grade. Because of its importance, it is
         recommended that the frequency remains a huge proportion of the grade.
       </div>
     </CarouselItem>

     <CarouselItem>
       <div className="mb-4">
         The <b className={colors[1].text}>duration</b> refers to the the total trip time, including
         any transfer wait times: if you board your first bus at 9am and you arrive at your destination
         at 9.45am, then the duration is 45 minutes.
       </div>

       <div className="mb-4">
         By default, the duration represents 30% of the grade. It is tempting to set the duration to a
         large proportion, but consider that long durations do not necessarily indicate bad transit;
         longer distances naturally involve longer commutes, whether by transit or by driving.
       </div>
     </CarouselItem>
   </CustomizedCarousel>
 )
}