import img1 from "../../assets/l-intro-1666032466.jpg";
import img2 from "../../assets/couple-home-workout.jpg";
import img3 from "../../assets/depositphotos_479957630-stock-photo-online-training-with-coach-remotely.jpg";
import img4 from "../../assets/get-the-most-out-of-your-gym-subscriptions-with-a-flexible-business-model.jpg";

function Banner() {
  return (
    <section className="bg-black relative w-full h-[95vh] flex flex-col lg:flex-row items-center justify-between">
      <div className="ml-20">
        <div className="text-white flex-1 lg:mr-8">
          <h1 className="text-4xl lg:text-4xl font-bold mb-4 animate-fade-right animate-once animate-duration-[2000ms]">
            Get Fit with Your Personal Trainer.
          </h1>
          <p className="text-lg lg:text-xl mb-6 animate-fade-right animate-once animate-duration-[2000ms]">
            Expert fitness coaching, personalized nutrition, and {<br />}{" "}
            holistic wellness — all in one platform.
          </p>
          <button className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded animate-fade-right animate-once animate-duration-[2000ms]">
            Get Started
          </button>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 flex-wrap justify-between mr-20">
        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-30 transition duration-300"></div>
        <img
          src={img1}
          alt="Training 1"
          className="w-1/2 object-cover p-3 animate-fade-down animate-once animate-duration-[2000ms] "
        />
        <img
          src={img2}
          alt="Training 2"
          className="w-1/2 object-cover p-3 animate-fade-down animate-once animate-duration-[2000ms]"
        />
        <img
          src={img3}
          alt="Training 3"
          className="w-1/2 object-cover p-3 animate-fade-up animate-once animate-duration-[2000ms]"
        />
        <img
          src={img4}
          alt="Training 4"
          className="w-1/2 object-cover p-3 animate-fade-up animate-once animate-duration-[2000ms]"
        />
      </div>
    </section>
  );
}

export default Banner;
