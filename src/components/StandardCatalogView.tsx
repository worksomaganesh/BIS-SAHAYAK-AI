import React from 'react';
import { FindStandardView, FindStandardSubTool } from './FindStandardView';

interface StandardCatalogViewProps {
  onAskAboutStandard: (prompt: string) => void;
  activeSubTool?: FindStandardSubTool;
  onSubToolChange?: (subTool: FindStandardSubTool) => void;
}

export const StandardCatalogView: React.FC<StandardCatalogViewProps> = (props) => {
  return <FindStandardView {...props} />;
};

export default StandardCatalogView;

