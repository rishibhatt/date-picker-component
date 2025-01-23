import './App.css';
import DateRangePicker from './date-picker';

function App() {
  const predefinedRanges = [
    {
      label: "Last 7 Days",
      range: [new Date(new Date().setDate(new Date().getDate() - 7)), new Date()] as [Date, Date],
    },
    {
      label: "Last 30 Days",
      range: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()] as [Date, Date],
    },
  ];

  return (
    <>
      <h1>SupplyHouse-DatePicker</h1>
      <DateRangePicker predefinedRanges={predefinedRanges} />
    </>
  );
}

export default App;
