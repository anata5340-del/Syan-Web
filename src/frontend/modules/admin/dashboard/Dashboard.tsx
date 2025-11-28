"use client";

import LineChart from "@/frontend/components/chart/lineChart";
import PieChart from "@/frontend/components/chart/pieChart";
import TabSection from "@/frontend/components/tab/tabSection";
import { Progress } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({
    allUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
  });
  const [totalFinances, setTotalFinances] = useState(0);
  const [filteredFinances, setFilteredFinances] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [financeChartData, setFinanceChartData] = useState([]);
  const [activeFinanceTab, setActiveFinanceTab] = useState("total");
  const [activeFinanceChartTab, setActiveFinanceChartTab] = useState("weekly");
  const [activeUserTab, setActiveUserTab] = useState("weekly");
  console.log(users);
  useEffect(() => {
    // Fetch user data
    axios
      .get("/api/users")
      .then((res) => {
        const fetchedUsers = res.data.users;
        setUsers(fetchedUsers);

        // Calculate user statistics
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const stats = {
          allUsers: fetchedUsers.length,
          newUsers: fetchedUsers.filter(
            (user) => new Date(user.createdAt) >= startOfMonth
          ).length,
          activeUsers: fetchedUsers.filter(
            (user) => user.active && !user.isDeleted
          ).length,
          inactiveUsers: fetchedUsers.filter(
            (user) => !user.active || user.isDeleted
          ).length,
        };

        setUserStats(stats);

        // Calculate total finances
        const totalFinance = fetchedUsers.reduce((total, user) => {
          return (
            total +
            user.packages.reduce((sum, pkg) => sum + (pkg.price || 0), 0)
          );
        }, 0);

        setTotalFinances(totalFinance);
        setFilteredFinances(totalFinance); // Default to total finances

        // Set default chart data
        const weeklyData = calculateUserChartData(fetchedUsers, "weekly");
        setChartData(weeklyData);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to fetch users");
      });
  }, []);

  // Handle finance tab changes
  useEffect(() => {
    if (activeFinanceTab === "total") {
      setFilteredFinances(totalFinances);
    } else if (activeFinanceTab === "today") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const dailyFinance = users.reduce((total, user) => {
        return (
          total +
          user.packages.reduce((sum, pkg) => {
            if (!pkg.startDate) {
              console.warn(`Missing startDate for package:`, pkg);
              return sum;
            }
            const parsedDate = parseDate(pkg.startDate); // Parse the date
            if (!parsedDate) {
              console.warn(`Invalid date: ${pkg.startDate}`);
              return sum;
            }
            console.log(today);
            console.log(parsedDate);
            return parsedDate >= today ? sum + (pkg.price || 0) : sum;
          }, 0)
        );
      }, 0);
      setFilteredFinances(dailyFinance);
    } else if (activeFinanceTab === "month") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyFinance = users.reduce((total, user) => {
        return (
          total +
          user.packages.reduce((sum, pkg) => {
            if (!pkg.startDate) {
              console.warn(`Missing startDate for package:`, pkg);
              return sum;
            }
            const parsedDate = parseDate(pkg.startDate); // Parse the date
            if (!parsedDate) {
              console.warn(`Invalid date: ${pkg.startDate}`);
              return sum;
            }
            return parsedDate >= startOfMonth ? sum + (pkg.price || 0) : sum;
          }, 0)
        );
      }, 0);
      setFilteredFinances(monthlyFinance);
    }
  }, [activeFinanceTab, users, totalFinances]);

  // Utility function to parse dates
  const parseDate = (dateString: string): Date | null => {
    // Handle `DD-MM-YYYY` format
    const parts = dateString.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day); // JS months are zero-indexed
      }
    }

    // Attempt to parse using `Date` constructor for other formats
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  };

  // Handle user tab changes
  useEffect(() => {
    const updatedChartData = calculateUserChartData(users, activeUserTab);
    console.log(updatedChartData);
    setChartData(updatedChartData);
  }, [activeUserTab, users]);

  useEffect(() => {
    const updatedFinanceChartData = calculateFinanceChartData(
      users,
      activeFinanceChartTab
    );
    setFinanceChartData(updatedFinanceChartData);
  }, [activeFinanceChartTab, users]);

  const calculateFinanceChartData = (userData, period) => {
    const now = new Date();

    // Utility to parse and normalize dates
    const formatDate = (dateString) => {
      // Handle `DD-MM-YYYY` format
      const parts = dateString.split("-");
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const localDate = new Date(year, month - 1, day); // JS months are zero-indexed
          return new Date(
            localDate.getTime() - localDate.getTimezoneOffset() * 60000
          );
        }
      }

      // Attempt to parse other formats using `Date` constructor
      const parsedDate = new Date(dateString);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    };

    // Format a `Date` object to `YYYY-MM-DD`
    const formatToISODate = (date) => {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return localDate.toISOString().slice(0, 10);
    };

    if (period === "weekly") {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - i + 1);
        return formatToISODate(date); // Format date without time zone issues
      }).reverse();

      return last7Days.map((date) => ({
        date,
        count: userData.reduce((total, user) => {
          return (
            total +
            user.packages.reduce((sum, pkg) => {
              if (!pkg.startDate) {
                console.warn(`Missing startDate for package:`, pkg);
                return sum;
              }
              const pkgDate = formatToISODate(formatDate(pkg.startDate));
              return pkgDate === date ? sum + (pkg.price || 0) : sum;
            }, 0)
          );
        }, 0),
      }));
    } else if (period === "monthly") {
      const last31Days = Array.from({ length: 31 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - i + 1);
        return formatToISODate(date); // Format date without time zone issues
      }).reverse();

      return last31Days.map((date) => ({
        date,
        count: userData.reduce((total, user) => {
          return (
            total +
            user.packages.reduce((sum, pkg) => {
              if (!pkg.startDate) {
                console.warn(`Missing startDate for package:`, pkg);
                return sum;
              }
              const pkgDate = formatToISODate(formatDate(pkg.startDate));
              return pkgDate === date ? sum + (pkg.price || 0) : sum;
            }, 0)
          );
        }, 0),
      }));
    } else if (period === "yearly") {
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i + 1);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }).reverse();

      return last12Months.map((month) => ({
        month,
        count: userData.reduce((total, user) => {
          return (
            total +
            user.packages.reduce((sum, pkg) => {
              if (!pkg.startDate) {
                console.warn(`Missing startDate for package:`, pkg);
                return sum;
              }
              const pkgMonth = `${formatDate(
                pkg.startDate
              )?.getFullYear()}-${String(
                formatDate(pkg.startDate)?.getMonth() + 1
              ).padStart(2, "0")}`;
              return pkgMonth === month ? sum + (pkg.price || 0) : sum;
            }, 0)
          );
        }, 0),
      }));
    }
  };

  const calculateUserChartData = (userData, period) => {
    const now = new Date();

    // Utility to format dates in `YYYY-MM-DD` without time zone offsets
    const formatDate = (date) => {
      const localDate = new Date(
        date.getTime() - date.getTimezoneOffset() * 60000
      );
      return localDate.toISOString().slice(0, 10);
    };

    if (period === "weekly") {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - i + 1);
        return formatDate(date); // Format without timezone issues
      }).reverse();

      return last7Days.map((date) => ({
        date,
        count: userData.filter(
          (user) => formatDate(new Date(user.createdAt)) === date
        ).length,
      }));
    } else if (period === "monthly") {
      const last31Days = Array.from({ length: 31 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - i + 1);
        return formatDate(date); // Format without timezone issues
      }).reverse();

      return last31Days.map((date) => ({
        date,
        count: userData.filter(
          (user) => formatDate(new Date(user.createdAt)) === date
        ).length,
      }));
    } else if (period === "yearly") {
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i + 1);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }).reverse();

      return last12Months.map((month) => ({
        date: month,
        count: userData.filter((user) => {
          const createdAt = new Date(user.createdAt);
          const userMonth = `${createdAt.getFullYear()}-${String(
            createdAt.getMonth() + 1
          ).padStart(2, "0")}`;
          return userMonth === month;
        }).length,
      }));
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-colororange mt-10 mb-5">
        SYAN Analytics
      </h2>
      <div className="flex flex-wrap justify-between gap-2 pb-8 w-full">
        {/* Left Section: User Stats */}
        <div className="flex flex-col w-[45%] gap-10">
          <div className="flex gap-5">
            <StatCard
              title="All Users"
              color="#4FB1C1"
              count={userStats.allUsers}
              totalCount={userStats.allUsers}
            />
            <StatCard
              title="New Users"
              color="#F9954B"
              totalCount={userStats.allUsers}
              count={userStats.newUsers}
            />
            <StatCard
              title="Active Users"
              color="#EF6A77"
              totalCount={userStats.allUsers}
              count={userStats.activeUsers}
            />
            <StatCard
              title="Inactive Users"
              color="#277C72"
              totalCount={userStats.allUsers}
              count={userStats.inactiveUsers}
            />
          </div>

          {/* User Stats Line Chart */}
          <div className="flex flex-col mt-10 shadowEffect rounded-2xl px-5 pb-10 pt-5">
            <div className="flex justify-between pb-5">
              <p className="text-2xl font-normal">User Stats</p>
              <div>
                <TabSection
                  type="Chart"
                  activeTab={activeUserTab}
                  setActiveTab={setActiveUserTab}
                />
              </div>
            </div>
            <LineChart data={chartData} type="users" />
          </div>
        </div>

        {/* Right Section: Finances */}
        <div className="w-[45%]">
          {/* Finances Overview */}
          <div className="flex flex-col justify-center items-center px-5 py-3 shadowEffect rounded-2xl">
            <div className="flex flex-col gap-3 items-center pb-4">
              <p className="text-2xl font-normal">Finances</p>
              <TabSection
                type="Progress"
                activeTab={activeFinanceTab}
                setActiveTab={setActiveFinanceTab}
              />
            </div>
            <Progress
              className="flex justify-center items-center"
              strokeColor={"#277C72"}
              type="circle"
              percent={(filteredFinances / totalFinances) * 100}
              format={() => (
                <>
                  <div className="text-base text-black">PKR</div>
                  <div className="text-black">{filteredFinances}</div>
                </>
              )}
            />
          </div>
          <div className="flex flex-col mt-10 shadowEffect rounded-2xl px-5 pb-10 pt-5">
            <div className="flex justify-between pb-5">
              <p className="text-2xl font-normal">Finances Stats</p>
              <div>
                <TabSection
                  type="Chart"
                  activeTab={activeFinanceChartTab}
                  setActiveTab={setActiveFinanceChartTab}
                />
              </div>
            </div>
            <LineChart data={financeChartData} type="finances" />
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, color, count, totalCount }) {
  return (
    <div className="flex flex-col justify-end shadowEffect rounded-2xl h-48 w-1/4 px-2 py-0">
      <div
        className="flex flex-col h-44 justify-between border-b-4"
        style={{ borderColor: color }}
      >
        <p className="text-xs font-light">{title}</p>
        <div className="flex justify-center">
          <PieChart
            color={color}
            count={count}
            widthBorder={2}
            total={totalCount}
          />
        </div>
        <div className="flex flex-col items-center justify-end">
          <p className="pb-4">{count}</p>
        </div>
      </div>
    </div>
  );
}
