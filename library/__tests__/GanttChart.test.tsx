import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GanttChart, GANTT_COLORS } from '../src/components/GanttChart';

// Mock image asset require
jest.mock('../assets/icons/down_4.png', () => '/mock-arrow.png', { virtual: true });

const ganttData = {
  title: 'Sprint Plan',
  projectName: 'Project Alpha',
  tasks: [
    { id: 't1', name: 'Design', startDate: '01/01', endDate: '10/01', progress: 80, status: 'In Progress' as const, color: 'blue' as const },
    { id: 't2', name: 'Dev',    startDate: '11/01', endDate: '25/01', progress: 40, status: 'On Target'  as const, color: 'green' as const },
    { id: 't3', name: 'Test',   startDate: '01/02', endDate: '15/02', progress: 0,  status: 'Overdue'    as const, color: 'red' as const },
  ],
};

const defaultProps = {
  data: ganttData,
  selectedYear: '2099', // Far future so "today" indicator won't show
  selectedMonth: 'Jan - Feb',
  selectedProject: 'Project Alpha',
  onProjectChange: jest.fn(),
};

describe('GanttChart', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should render selected project name', () => {
    render(<GanttChart {...defaultProps} />);
    expect(screen.getByText('Project Alpha')).toBeInTheDocument();
  });

  it('should apply testId', () => {
    render(<GanttChart {...defaultProps} testId="gc" />);
    expect(screen.getByTestId('gc')).toBeInTheDocument();
  });

  it('should render month headers', () => {
    render(<GanttChart {...defaultProps} />);
    expect(screen.getByText(`January 2099`)).toBeInTheDocument();
    expect(screen.getByText(`February 2099`)).toBeInTheDocument();
  });

  it('should render task names', () => {
    render(<GanttChart {...defaultProps} />);
    expect(screen.getAllByText('Design').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dev').length).toBeGreaterThan(0);
  });

  it('should render task status badges', () => {
    render(<GanttChart {...defaultProps} />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('On Target')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

it('should apply GANTT_COLORS to task bars', () => {
  render(<GanttChart {...defaultProps} />);
  expect(screen.getByTestId('gantt-task-t1')).toHaveStyle('background-color: rgb(37, 99, 235)');
  expect(screen.getByTestId('gantt-task-t2')).toHaveStyle('background-color: rgb(44, 160, 44)');
});


  it('should open project dropdown on button click', () => {
    render(<GanttChart {...defaultProps} />);
    const dropdownBtn = screen.getByText('Project Alpha').closest('button')!;
    fireEvent.click(dropdownBtn);
    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });

  it('should call onProjectChange when project option selected', () => {
    const onProjectChange = jest.fn();
    render(<GanttChart {...defaultProps} onProjectChange={onProjectChange} />);
    fireEvent.click(screen.getByText('Project Alpha').closest('button')!);
    fireEvent.click(screen.getByText('Project 1'));
    expect(onProjectChange).toHaveBeenCalledWith('Project 1');
  });

  it('should close dropdown after selecting project', () => {
    render(<GanttChart {...defaultProps} />);
    fireEvent.click(screen.getByText('Project Alpha').closest('button')!);
    fireEvent.click(screen.getByText('Project 1'));
    expect(screen.queryByText('Project 2')).not.toBeInTheDocument();
  });

  it('should render date range boxes for both months', () => {
    render(<GanttChart {...defaultProps} />);
    // Range boxes show date ranges
    expect(screen.getAllByText(/01\/01 - 10\/01/).length).toBeGreaterThan(0);
  });

  it('should not render tasks with monthIndex=-1', () => {
    const dataWithBadTask = {
      ...ganttData,
      tasks: [
        ...ganttData.tasks,
        { id: 'bad', name: 'Invisible', startDate: '01/06', endDate: '15/06', progress: 0, status: 'Completed' as const, color: 'teal' as const },
      ],
    };
    render(<GanttChart {...defaultProps} data={dataWithBadTask} />);
    expect(screen.queryByText('Invisible')).not.toBeInTheDocument();
  });

  it('should have correct displayName', () => {
    expect(GanttChart.displayName).toBe('GanttChart');
  });

  it('should export GANTT_COLORS constant', () => {
    expect(GANTT_COLORS.blue).toBe('rgba(37, 99, 235, 1)');
    expect(GANTT_COLORS.green).toBe('rgba(44, 160, 44, 1)');
  });
});