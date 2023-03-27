import D3Plot from '../D3Plot';
import React from 'react';

const App: React.FC<any> = ({ user, habit }) => {
    // const renderHabitPlot = () => {
    //     if (habit.records.length === 0) { return <p style={{ color: '#707070', fontStyle: 'italic' }}> No records found </p> }
    //     return (
    //         <D3Plot data={habit.records.map(({ date, value }: { date: Date, value: String }) => ({ date: new Date(date), value }))} />
    //     )
    // }

    // return (
    //     <div className="habit-record-plot-container">
    //         <h2 className="title"> Records Over Time </h2>
    //         {renderHabitPlot()}
    //     </div>
    // )

    const renderHabitPlot = () => {
        if (habit.records.length === 0) { return null }
        return (
            <div className="habit-record-plot-container">
                <h2 className="title"> Records Over Time </h2>
                <D3Plot data={habit.records.map(({ date, value }: { date: Date, value: String }) => ({ date: new Date(date), value }))} />
            </div>
        )
    }

    return (
        <div>
            {renderHabitPlot()}
        </div>
    )
}

export default App