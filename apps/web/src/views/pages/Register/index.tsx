import { EoRegist, CustRegist } from "./components/register-form";
function EoRegisterView() {
  return (
    <div className="px-10 py-5 mt-14">
      <h1 className="text-center font-bold text-2xl">
        Register Your Event Organizer!
      </h1>
      <EoRegist />
    </div>
  );
}

function CustRegisterView() {
  return (
    <div className="px-10 py-5 mt-14">
      <h1 className="text-center font-bold text-2xl">Register Your Account!</h1>
      <CustRegist />
      <div className="text-center mt-4 text-sm">
        <p>
          To register your Event Organizer, please click{" "}
          <a href="/eo-regist" className="text-blue-600 hover:text-blue-800">
            here
          </a>
        </p>
      </div>
    </div>
  );
}

export { EoRegisterView, CustRegisterView };
