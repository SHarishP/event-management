import RegisterForm from "./components/register-form";
function EoRegisterView() {
  return (
    <div className="px-10 py-5">
      <h1 className="text-center font-bold text-2xl">
        Register Your Event Organizer!
      </h1>
      <RegisterForm />
    </div>
  );
}

function CustRegisterView() {
  return (
    <div className="px-10 py-5">
      <h1 className="text-center font-bold text-2xl">Register Your Account!</h1>
      <RegisterForm />
    </div>
  );
}

export { EoRegisterView, CustRegisterView };
