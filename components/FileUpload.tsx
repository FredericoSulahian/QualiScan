import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Code, TestTube, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ScrollArea } from "./ui/scroll-area";
import { GherkinScenario, FileUpload as FileUploadType, FileType, AnalysisResult } from '../types';

interface FileUploadProps {
  title: string;
  description: string;
  onFileUpload: (file: FileUploadType) => void;
  onScenariosGenerated: (scenarios: GherkinScenario[]) => void;
  type: FileType;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  title, 
  description, 
  onFileUpload, 
  onScenariosGenerated,
  type 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const fileUpload: FileUploadType = {
        name: file.name,
        content,
        type
      };
      onFileUpload(fileUpload);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockScenarios: GherkinScenario[] = [
      {
        title: `User ${type === FileType.SOURCE ? 'logs in' : 'authentication'}`,
        steps: [
          'Given the user is on the login page',
          'When the user enters valid credentials',
          'Then the user should be redirected to the dashboard'
        ],
        tags: ['authentication', 'user-flow']
      },
      {
        title: `User ${type === FileType.SOURCE ? 'navigates to profile' : 'profile management'}`,
        steps: [
          'Given the user is logged in',
          'When the user clicks on profile settings',
          'Then the profile page should be displayed'
        ],
        tags: ['profile', 'navigation']
      },
      {
        title: `User ${type === FileType.SOURCE ? 'updates information' : 'data modification'}`,
        steps: [
          'Given the user is on the profile page',
          'When the user modifies their information',
          'Then the changes should be saved successfully'
        ],
        tags: ['data', 'modification']
      }
    ];
    
    const result: AnalysisResult = {
      scenarios: mockScenarios,
      summary: `Generated ${mockScenarios.length} scenarios from ${uploadedFile.name}`
    };
    
    setAnalysisResult(result);
    onScenariosGenerated(mockScenarios);
    setIsAnalyzing(false);
    setIsOpen(true);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    setIsOpen(false);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {type === FileType.SOURCE ? <Code className="h-5 w-5" /> : <TestTube className="h-5 w-5" />}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <motion.div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drop your file here</p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button onClick={() => document.getElementById(`file-input-${type}`)?.click()}>
              Choose File
            </Button>
            <input
              id={`file-input-${type}`}
              type="file"
              accept=".feature,.gherkin,.txt,.md,.js,.ts,.jsx,.tsx"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>Generated Scenarios ({analysisResult.scenarios.length})</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      ▼
                    </motion.div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ScrollArea className="h-64 mt-3">
                    <div className="space-y-3 pr-4">
                      {analysisResult.scenarios.map((scenario, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-muted rounded-lg"
                        >
                          <h4 className="font-medium mb-2">{scenario.title}</h4>
                          <div className="space-y-1">
                            {scenario.steps.map((step, stepIndex) => (
                              <p key={stepIndex} className="text-sm text-muted-foreground">
                                {step}
                              </p>
                            ))}
                          </div>
                          {scenario.tags && (
                            <div className="flex gap-1 mt-2">
                              {scenario.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};