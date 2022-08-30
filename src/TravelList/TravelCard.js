import classes from "./TravelCard.module.css";

const TravelCard = (props) => {
  return (
    <>
      <div className="row">
        {props.data.map((elment) => {
          return (
            <div className=" col-lg-4 col-md-6 col-sm-12">
              {/* <div className={`card `} > */}
              <div className={`card ${classes.travelcard}`}>
                <img
                  src={require(`../img/${elment.img}.jpg`)}
                  className={`card-img-top ${classes.travelimg}`}
                  alt="..."
                />

                <div className="card-body">
                  <h5 className={`card-title ${classes.title}`}>
                    {elment.location}
                  </h5>
                  <p
                    className={`card-text ${classes.forflex} ${classes.titlendate}`}
                  >
                    {elment.date}
                  </p>
                  <hr className={classes.hrconfig} />
                  <div className={classes.textfield}>
                    <p className="card-text">{elment.text}</p>
                    <div className={classes.cityname}>
                      <span>{elment.cityName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TravelCard;
