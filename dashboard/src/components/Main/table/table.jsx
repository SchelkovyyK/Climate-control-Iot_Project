import "./table.scss";

function Table({ logs }) {
  return (
    <table className="main__table" border="1">
      <thead>
        <tr>
          <th>Time</th>
          <th>Temp</th>
          <th>Hum</th>
          <th>Gas</th>
          <th>Emergency</th>
        </tr>
      </thead>
      <tbody>
        {logs.map((log, index) => (
          <tr key={index}>
            <td>{log.time}</td>
            <td>{log.temp}</td>
            <td>{log.hum}</td>
            <td>{log.gas}</td>
            <td>{log.emergency ? "YES" : "NO"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
