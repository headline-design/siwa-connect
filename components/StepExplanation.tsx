import React from 'react';
import { Alert } from './Alert';

interface StepExplanationProps {
  activeStep: number;
}

const StepExplanation: React.FC<StepExplanationProps> = ({ activeStep }) => {
  const steps = [
    {
      title: "Step 1: Connect Wallet",
      description: "In this step, you'll connect your Algorand wallet to the application. You can choose between Pera, Defly, Lute, or Kibisis wallets.",
      details: [
        "Click on the 'Connect Wallet button.",
        "Your chosen wallet app will open and ask for permission to connect.",
        "Once connected, your Algorand address will be displayed, and you'll move to the next step.",
      ],
      environment: "Client",
    },
    {
      title: "Step 2: Sign Message",
      description: "Now that your wallet is connected, you'll sign a message to prove ownership of your Algorand address.",
      details: [
        "Click the 'Sign In' button to initiate the signing process.",
        "A message will be generated containing your address, the current domain, and other details.",
        "Your wallet app will prompt you to sign this message.",
        "After signing, the signed message will be stored for verification.",
      ],
      environment: "Client",
      note: "The message will be prompted in the wallet app for your signature.",
    },
    {
      title: "Step 3: Verify Message",
      description: "In this final step, the signed message will be verified to complete the Sign-In with Algorand process.",
      details: [
        "Click the 'Verify SIWA Message' button to start the verification.",
        "The application will check if the signature is valid and matches the original message.",
        "If successful, you'll be signed in and can access the application.",
      ],
      environment: "Server",
      note: "In a production environment, this step should be executed on the server side. After verifying the message, the server should create a session or JWT for the user.",
    },
    {
      title: "Success",
      description: "Congratulations! You have successfully signed in with Algorand.",
      details: [
        "Your Algorand address is now authenticated.",
        "You can now access the features of the application that require authentication.",
        "To sign out, click the 'Disconnect' button.",
      ],
      environment: "Client",
    },
  ];

  const currentStep = steps[activeStep];

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-2">{currentStep.title}</h2>
      {currentStep.note && (
        <Alert variant="info" className="mb-4">
          {currentStep.note}
        </Alert>
      )}
      <p className="text-muted-foreground mb-4">{currentStep.description}</p>
      <ul className="list-disc pl-5 mb-4">
        {currentStep.details.map((detail, index) => (
          <li key={index} className="text-sm text-muted-foreground mb-2">{detail}</li>
        ))}
      </ul>
      <div className="bg-muted p-2 rounded-md text-sm">
        Environment: <span className="font-semibold">{currentStep.environment}</span>
      </div>

    </div>
  );
};

export default StepExplanation;

