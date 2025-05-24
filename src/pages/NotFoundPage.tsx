import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
      <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button 
        onClick={() => navigate('/')} 
        variant="primary" 
        size="lg"
        leftIcon={<Home size={20} />}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;