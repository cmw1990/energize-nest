import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { EasierManageApp } from './EasierManageApp';
import { useAuth } from '../../components/AuthProvider';

const EasierManagePage: React.FC = () => {
  const { session } = useAuth();
  
  return (
    <BrowserRouter basename="/easier-manage">
      <EasierManageApp session={session} />
    </BrowserRouter>
  );
};

export default EasierManagePage; 