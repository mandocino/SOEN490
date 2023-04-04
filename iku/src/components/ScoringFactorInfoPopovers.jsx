import Carousel from "react-material-ui-carousel";
import React, {useEffect, useState} from "react";
import {CloseButton} from "./custom/CloseButton";


const lightThemeNavButtonColor = "#000";
const darkThemeNavButtonColor = "#10b981";

function CarouselItem({children}) {
  return (
    <div className="h-full bg-white dark:bg-black rounded-xl p-2 overflow-y-auto">
      {children}
    </div>
  )
}

function CustomizedCarousel({children, handleClose=null}) {
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
    <>
      <CloseButton onClick={handleClose} />
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
    </>
  )
}


export function ConsistencyImportanceInfo({handleClose}) {
  return (
    <CustomizedCarousel handleClose={handleClose}>
      <CarouselItem>
        <div>
          These three buttons impact how important the <b>consistency</b> of the transit service offered is.
        </div>
        <br/>

        <ul className="ml-4 list-disc">
          <li>
            <b>Max consistency</b> will prioritize transit services that provide a more consistent (predictable)
            service
          </li>
          <li>
            <b>Max average</b> will ignore the consistency outright and give the edge to wherever gets the best
            service on average
          </li>
          <li>
            <b>Balanced</b> sits between the two.
          </li>
        </ul>
        <br/>

        <div>
          If you need explanations on why the consistency in service, or guidance on how to set these scoring
          factors, click the arrows on the sides to view details.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          In general, higher consistency means less variance in the measured metric/factor. For example, if
          Route 1 comes every 20 minutes, while Route 2 comes every 10-30 minutes, then both routes have
          the same average frequency (20 minutes) but Route 2 is much less consistent.
        </div>
        <br/>

        <div>
          The precise definition of consistency for this application depends on whether we're grading the frequency or
          the duration:
        </div>
        <br/>

        <ul className="ml-4 list-disc">
          <li>
            For frequency, a higher consistency means more even spacing between departures
          </li>
          <li>
            For duration, a higher consistency means less variance in trip length.
          </li>
        </ul>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          Scoring for <b>max consistency</b> scoring will attempt to correspond to the idea of preferring consistent and
          predictable service no matter what. The main limitation of this approach is that conventionally bad transit
          may receive higher scores than it should.
        </div>
        <br/>

        <div>
          The most obvious manifestation of this limitation is that if a consistent service has an enhanced but separate
          alternative option, this will unfairly negatively impact the score. For example, suppose we supplement a bus
          every 15 minutes with an express bus every 20 minutes, this enhancement will create uneven gaps and thus
          <b>lower</b> the score, despite the presence of that bus being a net positive for the service.
        </div>
      </CarouselItem>

      <CarouselItem>
        <div>
          Scoring for <b>max average</b> scoring will attempt to correspond to the idea of preferring service that
          performs better on average no matter what. This can create some odd situations where one place that has
          conventionally better transit than another can receive the same or worse score simply because it's a bit worse
          on average than the other.
        </div>
        <br/>

        <div>
          An example of this limitation is that if two transit services perform the same on average, but one is
          predictable while the other is unreliable, then they will receive the same grade despite the predictable
          (consistent) service being strictly better than the other.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          <b>Balanced</b> scoring will attempt to correspond to the idea of wanting consistent service in general, but
          preferring one service over another if it has a noticeably better average performance.
        </div>
        <br/>

        <div>
          This is the default setting.
        </div>
        <br/>
      </CarouselItem>
    </CustomizedCarousel>
  )
}


export function WorstAcceptableCasesInfo({handleClose}) {
  return (
    <CustomizedCarousel handleClose={handleClose}>
      <CarouselItem>
        <div>
          The worst acceptable frequency or duration refers to the level of service that would result in a score of 0
          for the respective scoring components (every score is the average of a frequency and a duration component).
        </div>
        <br/>

        <div>
          If you need explanations on what this means, or guidance on how to set this scoring
          factor, click the arrows on the sides to view details.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          The worst acceptable frequency indicates what average gap between departures would give a frequency component
          score of 0. For example, if the worst acceptable frequency is 60 minutes, then a bus that come hourly would
          receive a score of 0, as would buses that every 2 hours, etc.
        </div>
        <br/>

        <div>
          The worst acceptable duration indicates what average trip length would give a duration component
          score of 0. For example, if the worst acceptable duration is 120 minutes, then a route that takes two hours to
          reach the destination would receive a score of 0, as would any longer routes.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          Low settings for either component provide higher levels of granularity (i.e. the impact each minute has on the
          score is more noticeable). However, origins too far away (such as suburbs) will all receive scores of 0 making
          it impossible to compare them.
        </div>
        <br/>

        <div>
          On the other hand, high settings for either component accommodate origins that are far away, but the
          difference in service level becomes less pronounced: the difference between a 15min commute and a 30min
          commute may only be a couple of points, for example.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          If you are looking to grade transit for origins close to your main destinations, you should set these values
          lower: for example, to 30 minutes for frequency and 45 minutes for duration.
        </div>
        <br/>

        <div>
          On the other hand, if you are looking to grade transit for origins further away (such as suburbs) then you may
          want to maintain the default values, and increase both if you start seeing scores of 0.
        </div>
        <br/>

        <div>
          By default, the worst acceptable frequency is 75 minutes, and the worst acceptable duration is 120 minutes.
          This includes most suburbs while maintaining a reasonable level of granularity in the scores.
        </div>
        <br/>
      </CarouselItem>
    </CustomizedCarousel>
  )
}


export function AccessibilitySettingsInfo({handleClose}) {
  return (
    <CustomizedCarousel handleClose={handleClose}>
      <CarouselItem>
        <div>
          The walk reluctance simply refers to how bad walking is, compared to being in transit for the same amount of
          time. Higher walk reluctance causes the routing algorithm to prioritize routes with less walking and ignore
          routes with too much walking.
        </div>
        <br/>


        <div>
          Selecting "Wheelchair Accessible Routes" simply tells the route planner to limit itself to only routes that
          are wheelchair accessible.
        </div>
        <br/>

        <div>
          If you need explanations on what the walk reluctance means, or guidance on how to set the walk reluctance
          scoring factor, click the arrows on the sides to view details.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          The walk reluctance does not directly impact the scoring; it instead determines what routes will be suggested
          by the routing algorithm:
        </div>
        <br/>

        <ul className="ml-4 list-disc">
          <li>
            Lower values for the walk reluctance means the routing algorithm will prefer routes with shorter durations.
          </li>
          <br/>
          <li>
            Higher values for the walk reluctance means the routing algorithm will prefer (longer) routes that involve
            less walking.
          </li>
        </ul>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          By default, the walk reluctance is set to 2. This corresponds well with the idea of not wanting to walk too
          much, but being comfortable with walking to save significant amounts of time (vs. taking a longer
          route).
        </div>
        <br/>

        <div>
          Setting the walk reluctance to 1 makes the routing algorithm always chase the shortest duration possible, even
          if it involves a lot of walking.
        </div>
        <br/>

        <div>
          On the other hand, users such as the elderly or those with reduced mobility may prefer to set the walk
          reluctance to higher amounts; values of 5-9 tend to eliminate most walking from routes wherever possible.
        </div>
        <br/>
      </CarouselItem>

      <CarouselItem>
        <div>
          To be more technical on what the walk reluctance is: it is a multiplier that affects route generation.
          For example, suppose Route 1 involves a 10 minute bus ride, and then a 15 minute walk, while Route 2 involves
          a 25 minute bus ride and then a 5 minute walk. Intuitively, Route 1 should be suggested since it's shorter by
          5 minutes.
        </div>
        <br/>

        <div>
          Now let's also suppose we use a walk reluctance of 2. The routing algorithm will multiply the walk components
          by 2 then compare the durations. Route 1 would thus be 10 + 2*15 = 40 minutes, while Route 2 would be 25 + 2*5
          = 35 minutes, so the algorithm will recommend Route 2.
        </div>
        <br/>
      </CarouselItem>
    </CustomizedCarousel>
  )
}


export function FactorWeightsInfo({colors, handleClose}) {
 return (
   <CustomizedCarousel handleClose={handleClose}>
     <CarouselItem>
       <div>
         The two core scoring factor weights are the <b className={colors[0].text}>frequency</b> and
         the <b className={colors[1].text}>duration</b>. Use the provided slider to adjust the
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


export function NightDayWeightsInfo({colors, handleClose}) {
  return (
    <CustomizedCarousel handleClose={handleClose}>
      <CarouselItem>
        <div>
          The night score is the weighted average between the <b className={colors[0].text}>Weeknight</b> score,
          the <b className={colors[1].text}>Friday night</b> <span className={colors[1].text}>(Saturday AM)</span> score,
          and the <b className={colors[2].text}> Saturday night</b> <span className={colors[2].text}>(Sunday AM)</span> score.
          Use the provided slider to adjust the proportional impact of these three days on the night score.
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


export function NightDirectionWeightsInfo({colors, handleClose}) {
  return (
    <CustomizedCarousel handleClose={handleClose}>
      <CarouselItem>
        <div>
          The night transit service varies depending on whether or not you are travelling from home towards some
          destination (nominally the city center) or vice versa. Thus the transit service <b className={colors[0].text}>
          towards the destination</b> and <b className={colors[1].text}>from the destination</b> are graded separately.
          Use the provided slider to adjust the proportional impact of these two directions on the night score.
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


export function WeekendWeightsInfo({colors, handleClose}) {
  return (
    <CustomizedCarousel handleClose={handleClose}>
      <CarouselItem>
        <div>
          The weekend score is the average between the <b className={colors[0].text}>Saturday</b> score and
          the <b className={colors[1].text}>Sunday</b> score. Use the provided slider to adjust the
          proportional impact of these two days on the weekend score.
        </div>
        <br/>

        <div>
          If you need explanations on why the separate grading matters, or guidance on how to set this scoring
          factor, click the arrows on the sides to view details.
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


export function TimeSliceWeightsInfo({colors, handleClose}) {
  return (
    <CustomizedCarousel handleClose={handleClose}>
      <CarouselItem>
        <div>
          The four adjustable time periods are the <b className={colors[0].text}>rush hour</b>,
          the <b className={colors[1].text}>off-peak</b>, the <b className={colors[2].text}>overnight</b>, and
          the <b className={colors[3].text}>weekend</b> time periods. Use the provided slider to adjust the
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