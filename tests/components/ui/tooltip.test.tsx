import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, BetterTooltip } from '../../../components/ui/tooltip';
import { waitFor } from '@testing-library/react';

describe('Tooltip Component', () => {
  it('renders TooltipTrigger correctly', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });
  
});
