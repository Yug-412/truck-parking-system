import "./ReportFilters.css";

function ReportFilters({
  search,
  setSearch,
  payment,
  setPayment,
  dateFilter,
  setDateFilter,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onSearch,
  onReset,
}) {
  return (
    <div className="report-filter-card">

      <div className="filter-radio-group">

        <label className="radio-item">
          <input
            type="radio"
            value="all"
            checked={dateFilter === "all"}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <span>All Reports</span>
        </label>

        <label className="radio-item">
          <input
            type="radio"
            value="today"
            checked={dateFilter === "today"}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <span>Today</span>
        </label>

        <label className="radio-item">
          <input
            type="radio"
            value="month"
            checked={dateFilter === "month"}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <span>This Month</span>
        </label>

        <label className="radio-item">
          <input
            type="radio"
            value="custom"
            checked={dateFilter === "custom"}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <span>Custom Date Range</span>
        </label>

      </div>

      {dateFilter === "custom" && (

        <div className="date-filter-row">

          <div className="input-group">

            <label>From Date</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>To Date</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />

          </div>

        </div>

      )}

      <div className="search-filter-row">

        <div className="input-group">

          <label>Truck Number</label>

          <input
            type="text"
            placeholder="Search Truck Number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="input-group">

          <label>Payment</label>

          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
          >
            <option>All</option>
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
          </select>

        </div>

        <button
          className="search-btn"
          onClick={onSearch}
        >
          Search
        </button>

        <button
          className="reset-btn"
          onClick={onReset}
        >
          Reset
        </button>

      </div>

    </div>
  );
}

export default ReportFilters;