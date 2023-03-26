import Carousel from "react-material-ui-carousel";
import React, {useEffect, useState} from "react";


const lightThemeNavButtonColor = "#000";
const darkThemeNavButtonColor = "#10b981";

function CarouselItem({children}) {
  return (
    <div className="h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-emerald-darker dark:to-black rounded-xl p-2 overflow-y-auto">
      {children}
    </div>
  )
}

function CustomizedCarousel({children}) {
  const [navButtonBackgroundColor, setNavButtonBackgroundColor] = useState('#000');

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (prefersDark) {
      setNavButtonBackgroundColor(darkThemeNavButtonColor);
    } else {
      setNavButtonBackgroundColor(lightThemeNavButtonColor);
    }
  }, []);

  return (
    <Carousel
      autoPlay={false}
      cycleNavigation={false}
      duration={350}
      swipe={false}
      height={'24rem'}
      className="text-emerald-darker dark:text-white"
      navButtonsProps={{
        style: {
          backgroundColor: navButtonBackgroundColor,
        }
      }}
      sx={{
        button: {
          '&:hover': {
            opacity: '1 !important'
          },
        }, buttonWrapper: {
          '&:hover': {
            '& $button': {
              backgroundColor: "black", filter: "brightness(120%)", opacity: "1"
            }
          }
        },
      }}
    >
      {children}
    </Carousel>
  )
}


export function FactorWeightsInfo({colors}) {
 return (
   <CustomizedCarousel>
     <CarouselItem>
       <div>
         The two core scoring factor weights are the <b className={colors[0].text}>frequency</b> and
         the <b className={colors[1].text}>duration</b>. Use the slider below to adjust the
         proportional impact of these factors.
       </div>
       <br/>

       <div>
         If you need explanations on what these factors mean, or guidance on how to set these scoring
         factors, click the arrows on the sides to view details.
       </div>
       <br/>
     </CarouselItem>

     <CarouselItem>
       <div>
         The <b className={colors[0].text}>frequency</b> refers to the gap between departures: if the
         departures are spaced on average 15 minutes apart (such that departures are at 9:00 AM, 9:15 AM,
         etc.), then the frequency is 15. The frequency is by far regarded to be the most important
         aspect of any transit service.
       </div>
       <br/>

       <div>
         By default, the frequency represents 70% of the grade. Because of its importance, it is
         recommended that the frequency remains a huge proportion of the grade.
       </div>
       <br/>
     </CarouselItem>

     <CarouselItem>
       <div>
         The <b className={colors[1].text}>duration</b> refers to the the total trip time, including
         any transfer wait times: if you board your first bus at 9am and you arrive at your destination
         at 9.45am, then the duration is 45 minutes.
       </div>
       <br/>

       <div>
         By default, the duration represents 30% of the grade. It is tempting to set the duration to a
         large proportion, but consider that long durations do not necessarily indicate bad transit;
         longer distances naturally involve longer commutes, whether by transit or by driving.
       </div>
       <br/>
     </CarouselItem>
   </CustomizedCarousel>
 )
}


export function NightDayWeightsInfo({colors}) {
  return (
    <CustomizedCarousel>
      <CarouselItem>
        <div>
          The night score is the weighted average between the <b className={colors[0].text}>Weeknight</b> score,
          the <b className={colors[1].text}>Friday night</b> <span className={colors[1].text}>(Saturday AM)</span> score,
          and the <b className={colors[2].text}> Saturday night</b> <span className={colors[2].text}>(Sunday AM)</span> score.
          Use the slider below to adjust the proportional impact of these three days on the night score.
        </div>
        <br/>

        <div>
          If you need explanations on why the separate grading matters, or guidance on how to set these scoring
          factors, click the arrows on the sides to view details.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          The days are graded separately because transit service differs between the nights of the week:
          Friday night and Saturday night transit is more important to most users, which is why transit agencies often
          provide more service on Friday and Saturday nights. Thus, also why you may want to change the weighting
          between the three days according to your needs.
        </div>
        <br/>

        <div>
          By default, weeknights represent 30% of the night score, while friday and saturday nights each represent 35%
          of the night score.
        </div>
        <br/>
      </CarouselItem>
    </CustomizedCarousel>
  )
}


export function NightDirectionWeightsInfo({colors}) {
  return (
    <CustomizedCarousel>
      <CarouselItem>
        <div>
          The night transit service varies depending on whether or not you are travelling from home towards some
          destination (nominally the city center) or vice versa. Thus the transit service <b className={colors[0].text}>
          towards the destination</b> and <b className={colors[1].text}>from the destination</b> are grades separately.
          Use the slider below to adjust the proportional impact of these two directions on the night score.
        </div>
        <br/>

        <div>
          If you need explanations on why the separate grading matters, or guidance on how to set these scoring
          factors, click the arrows on the sides to view details.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          The directions are graded separately because at night, most trips are from people returning home after
          spending the night out. Thus, transit agencies often provide more service returning home than going downtown,
          and is also why you may want to change the weighting between the two directions.
        </div>
        <br/>

        <div>
          By default, travelling towards the destination represents 30% of the night score, while returning home
          represents 70% of the night score.
        </div>
        <br/>
      </CarouselItem>
    </CustomizedCarousel>
  )
}


export function WeekendWeightsInfo({colors}) {
  return (
    <CustomizedCarousel>
      <CarouselItem>
        <div>
          The weekend score is the average between the <b className={colors[0].text}>Saturday</b> score and
          the <b className={colors[1].text}>Sunday</b> score. Use the slider below to adjust the
          proportional impact of these two days on the weekend score.
        </div>
        <br/>

        <div>
          If you need explanations on why the separate grading matters, or guidance on how to set this scoring
          factors, click the arrows on the sides to view details.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          The days are graded separately because transit service differs between Saturday and Sunday. This is due to
          varying user needs; Saturday transit is more important to some users, which is why transit agencies sometimes
          provide more service on Saturday, and is also why you may want to change the weighting between the two days.
        </div>
        <br/>

        <div>
          By default, Saturday represents 60% of the weekend score, while Sunday represents 40% of the weekend score.
        </div>
        <br/>
      </CarouselItem>
    </CustomizedCarousel>
  )
}


export function TimeSliceWeightsInfo({colors}) {
  return (
    <CustomizedCarousel>
      <CarouselItem>
        <div>
          The four adjustable time periods are the <b className={colors[0].text}>rush hour</b>,
          the <b className={colors[1].text}>off-peak</b>, the <b className={colors[2].text}>overnight</b>, and
          the <b className={colors[3].text}>weekend</b> time periods. Use the slider below to adjust the
          proportional impact of these factors.
        </div>
        <br/>

        <div>
          If you need explanations on what these time periods represent, what impact they have on the score, or guidance
          on how to set these time periods, click the arrows on the sides to view details.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          <b className={colors[0].text}>Rush hour</b> trips refer to those made towards the destination in the morning,
          as well as those made returning home in the evening. Nominally, these refer to time periods of <b>6:00 AM to
          10:00 AM</b> going and <b>3:00 PM to 7:00 PM</b> returning.
        </div>
        <br/>

        <div>
          For many, this is the critical period for transit service. There are often measures taken to help improve
          rush hour transit service, such as improved frequencies, express buses, or reserved lanes to skip traffic.
        </div>
        <br/>

        <div>
          By default, the rush hour period represents 40% of the overall transit score.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          <b className={colors[1].text}>Off-peak</b> trips refer to those made during weekdays, from roughly <b>6:00
          AM until 1:00 AM</b> (of the following day), excluding those that fall under rush hour. Note
          that cross-rush-hour trips (i.e. those going "the opposite direction of the rush" count as off-peak trips, but
          weekend trips do <b>not</b> count.
        </div>
        <br/>

        <div>
          For many, this is the next most important period for transit service. Off-peak trips often have decent
          frequencies; they may also benefit from extended operating hours on some express bus lines, too.
        </div>
        <br/>

        <div>
          By default, the off peak period represents 30% of the overall transit score.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          <b className={colors[2].text}>Overnight</b> trips refer to those made late at night, from roughly <b>1:00
          AM until 5:00 AM</b>, in both directions (though service for return trips is generally better -- see the Night
          Direction factor help for more info).
        </div>
        <br/>

        <div>
          For many, this is the least important period for transit service. Most bus lines do not operate at these hours.
          Some agencies run a special network of low-frequency, far-reaching overnight service buses, but most do not
          provide any night service.
        </div>
        <br/>

        <div>
          By default, the off peak period represents 10% of the overall transit score.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          <b className={colors[3].text}>Weekend</b> trips refer to those made during the daytime on weekends, at all
          hours (except those covered by overnight transit), in both directions.
        </div>
        <br/>

        <div>
          Weekend transit is often less important than off-peak transit. Agencies generally do not operate special
          weekend service; instead some (but not all) standard weekday transit routes would run at lower frequencies to
          provide weekend service.
        </div>
        <br/>

        <div>
          By default, the weekend period represents 20% of the overall transit score.
        </div>
        <br/>
      </CarouselItem>
    </CustomizedCarousel>
  )
}