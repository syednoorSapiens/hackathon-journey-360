'use client';

import React, { useEffect, useState } from 'react';
import { DeathClaimForm } from '../../../components/DeathClaimForm';
import { Toaster } from '../../../components/ui/sonner';
import { isEmbedMode, getEmbedConfig } from '../../../utils/embedDetection';

/**
 * Death Claim Form Embed (Motor/Universal Life Product)
 * 
 * This route provides a standalone embeddable version of the death claim form
 * for the Universal Life Product in the North America Agent Portal.
 * Perfect for integrating into other React/Next.js applications.
 * 
 * Usage in another app:
 * <iframe src="http://localhost:3000/embed/motor" width="100%" height="800px" />
 * 
 * Optional URL parameters:
 * - hideHeader=false : Show header even in iframe mode
 * - hideStepper=true : Hide the progress stepper
 * - compact=true : Use compact spacing
 * 
 * Or as a component import (if same codebase):
 * import DeathClaimForm from './components/DeathClaimForm';
 */
export default function MotorEmbedPage() {
  const [embedConfig, setEmbedConfig] = useState({
    hideHeader: true,
    hideFooter: false,
    hideStepper: false,
    compact: false,
  });
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    // Check if we're in an iframe and get configuration
    const embedded = isEmbedMode();
    const config = getEmbedConfig();
    
    console.log('🔍 Motor Embed - Checking iframe mode:', embedded);
    console.log('📋 Motor Embed - Config:', config);
    console.log('📍 Window.self:', window.self);
    console.log('📍 Window.top:', window.top);
    console.log('📍 Are they equal?', window.self === window.top);
    
    setIsEmbedded(embedded);
    setEmbedConfig(config);
  }, []);

  const handleFormDataChange = (data: any) => {
    // Log form data changes for debugging
    console.log('Death Claim Form Data:', data);
    
    // Post messages to parent window if embedded in iframe
    if (typeof window !== 'undefined' && window.parent !== window) {
      window.parent.postMessage({
        type: 'DEATH_CLAIM_FORM_UPDATE',
        data: data
      }, '*');
    }
  };

  return (
    <>
      <div className="w-full min-h-screen bg-background">
        <DeathClaimForm
          showStepper={!embedConfig.hideStepper}
          stepperType="progress"
          borderRadius="rounded"
          spacing={embedConfig.compact ? 'compact' : 'comfortable'}
          labelPosition="top"
          inputSize="md"
          template="simple"
          onFormDataChange={handleFormDataChange}
          hideHeader={isEmbedded && embedConfig.hideHeader}
        />
      </div>
      <Toaster />
    </>
  );
}
