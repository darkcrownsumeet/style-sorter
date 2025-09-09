import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, Sparkles, User, Shirt, TrendingUp } from 'lucide-react';

// Import generated images
import maleGenderImg from '@/assets/male-gender.jpg';
import femaleGenderImg from '@/assets/female-gender.jpg';
import casualStyleImg from '@/assets/casual-style.jpg';
import formalStyleImg from '@/assets/formal-style.jpg';
import vintageStyleImg from '@/assets/vintage-style.jpg';
import sportyStyleImg from '@/assets/sporty-style.jpg';
import topItemImg from '@/assets/top-item.jpg';
import bottomItemImg from '@/assets/bottom-item.jpg';
import fullOutfitImg from '@/assets/full-outfit.jpg';
import rectangleBodyImg from '@/assets/rectangle-body.jpg';
import hourglassBodyImg from '@/assets/hourglass-body.jpg';
import heightGuideImg from '@/assets/height-guide.jpg';

// Mock API key placeholder - users would add their actual API key here
const API_KEY = 'your-api-key-here';

interface UserData {
  gender: string;
  bodyShape: string;
  height: string;
  style: string;
  recommendationType: string;
  specificItem?: string;
  uploadedImage?: File;
}

interface StepOption {
  id: string;
  label: string;
  image: string;
}

const FashionWardrobe = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    gender: '',
    bodyShape: '',
    height: '',
    style: '',
    recommendationType: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    analysis: string;
    accessories: string;
  } | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  const genderOptions: StepOption[] = [
    { id: 'male', label: 'Male', image: maleGenderImg },
    { id: 'female', label: 'Female', image: femaleGenderImg },
  ];

  const maleBodyShapes: StepOption[] = [
    { id: 'rectangle', label: 'Rectangle', image: rectangleBodyImg },
    { id: 'triangle', label: 'Triangle', image: rectangleBodyImg },
    { id: 'inverted-triangle', label: 'Inverted Triangle', image: rectangleBodyImg },
    { id: 'oval', label: 'Oval', image: rectangleBodyImg },
  ];

  const femaleBodyShapes: StepOption[] = [
    { id: 'hourglass', label: 'Hourglass', image: hourglassBodyImg },
    { id: 'pear', label: 'Pear', image: hourglassBodyImg },
    { id: 'apple', label: 'Apple', image: rectangleBodyImg },
    { id: 'rectangle', label: 'Rectangle', image: rectangleBodyImg },
    { id: 'inverted-triangle', label: 'Inverted Triangle', image: rectangleBodyImg },
  ];

  const heightOptions: StepOption[] = [
    { id: 'short', label: 'Short', image: heightGuideImg },
    { id: 'average', label: 'Average', image: heightGuideImg },
    { id: 'tall', label: 'Tall', image: heightGuideImg },
  ];

  const styleOptions: StepOption[] = [
    { id: 'casual', label: 'Casual', image: casualStyleImg },
    { id: 'formal', label: 'Formal', image: formalStyleImg },
    { id: 'vintage', label: 'Vintage', image: vintageStyleImg },
    { id: 'sporty', label: 'Sporty', image: sportyStyleImg },
  ];

  const recommendationTypes: StepOption[] = [
    { id: 'top', label: 'Top', image: topItemImg },
    { id: 'bottom', label: 'Bottom', image: bottomItemImg },
    { id: 'full-outfit', label: 'Full Outfit', image: fullOutfitImg },
  ];

  const topItems: StepOption[] = [
    { id: 't-shirt', label: 'T-Shirt', image: topItemImg },
    { id: 'blouse', label: 'Blouse', image: topItemImg },
    { id: 'sweater', label: 'Sweater', image: topItemImg },
    { id: 'blazer', label: 'Blazer', image: topItemImg },
  ];

  const bottomItems: StepOption[] = [
    { id: 'jeans', label: 'Jeans', image: bottomItemImg },
    { id: 'skirt', label: 'Skirt', image: bottomItemImg },
    { id: 'trousers', label: 'Trousers', image: bottomItemImg },
    { id: 'shorts', label: 'Shorts', image: bottomItemImg },
  ];

  const handleSelection = useCallback((value: string) => {
    const stepMap = ['gender', 'bodyShape', 'height', 'style', 'recommendationType', 'specificItem'];
    const currentField = stepMap[currentStep - 1] as keyof UserData;
    
    setUserData(prev => ({ ...prev, [currentField]: value }));
    
    // Auto-advance to next step, with conditional logic
    if (currentStep === 5 && value === 'full-outfit') {
      // Skip specific item selection for full outfit
      setCurrentStep(7);
    } else if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUserData(prev => ({ ...prev, uploadedImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleGetRecommendation = useCallback(async () => {
    setIsLoading(true);
    setCurrentStep(8); // Loading screen
    
    // Simulate AI processing
    setTimeout(() => {
      setRecommendation({
        analysis: "Based on your body type and style preferences, this outfit perfectly complements your silhouette. The colors enhance your natural features while the cut flatters your body shape. The styling creates a balanced and harmonious look that aligns with your personal aesthetic.",
        accessories: "• A delicate gold necklace to add elegance\n• A structured handbag that complements the outfit's lines\n• Classic pointed-toe flats or low heels\n• A silk scarf for a pop of color\n• Minimalist earrings to frame your face"
      });
      setIsLoading(false);
      setCurrentStep(9); // Results screen
    }, 3000);
  }, []);

  const handleStartOver = useCallback(() => {
    setCurrentStep(0);
    setUserData({
      gender: '',
      bodyShape: '',
      height: '',
      style: '',
      recommendationType: '',
    });
    setUploadPreview(null);
    setRecommendation(null);
  }, []);

  const goBack = useCallback(() => {
    if (currentStep === 7 && userData.recommendationType === 'full-outfit') {
      // Go back to recommendation type if we skipped specific item
      setCurrentStep(5);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, userData.recommendationType]);

  const renderStepOptions = (options: StepOption[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {options.map((option) => (
        <Card
          key={option.id}
          className="fashion-card cursor-pointer p-0 overflow-hidden hover:scale-105 transition-transform"
          onClick={() => handleSelection(option.id)}
        >
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={option.image}
              alt={option.label}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-center">{option.label}</h3>
          </div>
        </Card>
      ))}
    </div>
  );

  const getProgressPercentage = () => {
    const totalSteps = userData.recommendationType === 'full-outfit' ? 7 : 8;
    return (currentStep / totalSteps) * 100;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress bar */}
        {currentStep > 0 && currentStep < 8 && (
          <div className="mb-8">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Welcome Screen */}
        {currentStep === 0 && (
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary animate-pulse-glow" />
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Fashion Wardrobe
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover your perfect style with AI-powered fashion recommendations
              </p>
            </div>
            <Button 
              onClick={() => setCurrentStep(1)}
              className="btn-hero animate-bounce-in"
            >
              Get Started
            </Button>
          </div>
        )}

        {/* Step 1: Gender */}
        {currentStep === 1 && (
          <div className="animate-slide-in-right">
            <div className="text-center mb-8">
              <User className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-2">Select Your Gender</h2>
              <p className="text-muted-foreground">This helps us provide more accurate recommendations</p>
            </div>
            {renderStepOptions(genderOptions)}
          </div>
        )}

        {/* Step 2: Body Shape */}
        {currentStep === 2 && (
          <div className="animate-slide-in-right">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Choose Your Body Shape</h2>
              <p className="text-muted-foreground">Select the shape that best describes your body type</p>
            </div>
            {renderStepOptions(userData.gender === 'male' ? maleBodyShapes : femaleBodyShapes)}
            <Button 
              variant="outline" 
              onClick={goBack}
              className="mt-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}

        {/* Step 3: Height */}
        {currentStep === 3 && (
          <div className="animate-slide-in-right">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Select Your Height</h2>
              <p className="text-muted-foreground">This affects proportions and styling recommendations</p>
            </div>
            {renderStepOptions(heightOptions)}
            <Button 
              variant="outline" 
              onClick={goBack}
              className="mt-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}

        {/* Step 4: Style */}
        {currentStep === 4 && (
          <div className="animate-slide-in-right">
            <div className="text-center mb-8">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-2">Choose Your Style</h2>
              <p className="text-muted-foreground">What style resonates with you most?</p>
            </div>
            {renderStepOptions(styleOptions)}
            <Button 
              variant="outline" 
              onClick={goBack}
              className="mt-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}

        {/* Step 5: Recommendation Type */}
        {currentStep === 5 && (
          <div className="animate-slide-in-right">
            <div className="text-center mb-8">
              <Shirt className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-2">What Would You Like?</h2>
              <p className="text-muted-foreground">Choose what type of recommendation you need</p>
            </div>
            {renderStepOptions(recommendationTypes)}
            <Button 
              variant="outline" 
              onClick={goBack}
              className="mt-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}

        {/* Step 6: Specific Item (conditional) */}
        {currentStep === 6 && userData.recommendationType !== 'full-outfit' && (
          <div className="animate-slide-in-right">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Choose Specific {userData.recommendationType === 'top' ? 'Top' : 'Bottom'}
              </h2>
              <p className="text-muted-foreground">What specific item are you looking for?</p>
            </div>
            {renderStepOptions(userData.recommendationType === 'top' ? topItems : bottomItems)}
            <Button 
              variant="outline" 
              onClick={goBack}
              className="mt-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}

        {/* Step 7: Image Upload */}
        {currentStep === 7 && (
          <div className="animate-slide-in-right">
            <div className="text-center mb-8">
              <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-2">Upload Your Outfit</h2>
              <p className="text-muted-foreground">Upload a photo of your outfit for personalized analysis</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <label className="upload-area block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">Click to upload image</p>
                <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB</p>
              </label>
              
              {uploadPreview && (
                <div className="mt-6">
                  <img
                    src={uploadPreview}
                    alt="Upload preview"
                    className="w-full max-w-xs mx-auto rounded-lg shadow-lg"
                  />
                  <Button
                    onClick={handleGetRecommendation}
                    className="btn-hero w-full mt-6"
                    disabled={!userData.uploadedImage}
                  >
                    Get My Recommendation
                  </Button>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              onClick={goBack}
              className="mt-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        )}

        {/* Loading Screen */}
        {currentStep === 8 && isLoading && (
          <div className="text-center animate-fade-in">
            <div className="spinner mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Your Style...</h2>
            <p className="text-muted-foreground">Our AI is crafting personalized recommendations for you</p>
          </div>
        )}

        {/* Results Screen */}
        {currentStep === 9 && recommendation && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-3xl font-bold mb-2">Your Fashion Recommendation</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="fashion-card">
                <h3 className="text-xl font-bold mb-4 text-primary">Color & Style Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">{recommendation.analysis}</p>
              </Card>
              
              <Card className="fashion-card">
                <h3 className="text-xl font-bold mb-4 text-primary">Accessory Suggestions</h3>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {recommendation.accessories}
                </div>
              </Card>
            </div>
            
            <div className="text-center mt-8">
              <Button onClick={handleStartOver} className="btn-hero">
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FashionWardrobe;