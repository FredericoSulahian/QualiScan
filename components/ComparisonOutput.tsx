import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { GherkinScenario } from '../types';
import { calculateCoverage, compareScenarios } from "../lib/utils.js";

interface ComparisonOutputProps {
  sourceScenarios: GherkinScenario[];
  qaScenarios: GherkinScenario[];
}

export const ComparisonOutput: React.FC<ComparisonOutputProps> = ({ 
  sourceScenarios, 
  qaScenarios 
}) => {
  const coverage = calculateCoverage(sourceScenarios, qaScenarios);
  const { missing, overlap, edgeCases } = compareScenarios(sourceScenarios, qaScenarios);

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (percentage >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Comparison Output
        </CardTitle>
        <CardDescription>
          Analysis of test coverage and scenario comparison
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Coverage Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 bg-muted rounded-lg"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            {getStatusIcon(coverage)}
            <span className={`text-2xl font-bold ${getStatusColor(coverage)}`}>
              {coverage}%
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Test Coverage
          </p>
          <div className="mt-3 flex justify-center gap-4 text-sm">
            <span>Source: {sourceScenarios.length}</span>
            <span>QA: {qaScenarios.length}</span>
          </div>
        </motion.div>

        {/* Tabs for different views */}
        <Tabs defaultValue="missing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="missing" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Missing ({missing.length})
            </TabsTrigger>
            <TabsTrigger value="overlap" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Overlap ({overlap.length})
            </TabsTrigger>
            <TabsTrigger value="edgeCases" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Edge Cases ({edgeCases.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="missing" className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                <AnimatePresence>
                  {missing.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground py-8"
                    >
                      No missing scenarios found! 🎉
                    </motion.p>
                  ) : (
                    missing.map((scenario: GherkinScenario, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <h4 className="font-medium text-red-800 mb-2">{scenario.title}</h4>
                        <div className="space-y-1">
                          {scenario.steps.map((step: string, stepIndex: number) => (
                            <p key={stepIndex} className="text-sm text-red-700">
                              {step}
                            </p>
                          ))}
                        </div>
                        {scenario.tags && (
                          <div className="flex gap-1 mt-2">
                            {scenario.tags.map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="overlap" className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                <AnimatePresence>
                  {overlap.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground py-8"
                    >
                      No overlapping scenarios found
                    </motion.p>
                  ) : (
                    overlap.map((scenario: GherkinScenario, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-green-50 border border-green-200 rounded-lg"
                      >
                        <h4 className="font-medium text-green-800 mb-2">{scenario.title}</h4>
                        <div className="space-y-1">
                          {scenario.steps.map((step: string, stepIndex: number) => (
                            <p key={stepIndex} className="text-sm text-green-700">
                              {step}
                            </p>
                          ))}
                        </div>
                        {scenario.tags && (
                          <div className="flex gap-1 mt-2">
                            {scenario.tags.map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="edgeCases" className="mt-4">
            <ScrollArea className="h-64">
              <div className="space-y-3 pr-4">
                <AnimatePresence>
                  {edgeCases.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-muted-foreground py-8"
                    >
                      No edge cases found
                    </motion.p>
                  ) : (
                    edgeCases.map((scenario: GherkinScenario, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                      >
                        <h4 className="font-medium text-yellow-800 mb-2">{scenario.title}</h4>
                        <div className="space-y-1">
                          {scenario.steps.map((step: string, stepIndex: number) => (
                            <p key={stepIndex} className="text-sm text-yellow-700">
                              {step}
                            </p>
                          ))}
                        </div>
                        {scenario.tags && (
                          <div className="flex gap-1 mt-2">
                            {scenario.tags.map((tag: string, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};