import React from "react";

interface Log {
  date: string;
  user: string;
  chatTitle?: string;
  chatId?: string;
  text: string;
}

interface LoggingInfoProps {
  loggingEnabled: boolean;
  loadingLogs: boolean;
  logs: Log[];
  toggleLogging: (enable: boolean) => void;
}

const LoggingInfo: React.FC<LoggingInfoProps> = ({
  loggingEnabled,
  loadingLogs,
  logs,
  toggleLogging,
}) => (
  <div className="mb-8">
    <div className="flex items-center mb-2">
      <h3 className="font-semibold mr-4">General Logs</h3>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={loggingEnabled}
          onChange={e => toggleLogging(e.target.checked)}
          className="mr-2"
        />
        <span className="text-sm">{loggingEnabled ? "Logging ON" : "Logging OFF"}</span>
      </label>
    </div>
    {loggingEnabled ? (
      <div className="border rounded bg-slate-50 p-2 max-h-64 overflow-y-auto text-xs">
        {loadingLogs ? (
          <div>Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-slate-400">No logs yet.</div>
        ) : (
          <ul className="space-y-1">
            {logs.slice(-50).reverse().map((log, i) => (
              <li key={i} className="border-b border-slate-100 pb-1">
                <span className="text-slate-500">[{new Date(log.date).toLocaleTimeString()}]</span>{" "}
                <span className="font-mono">{log.user}</span>{" "}
                <span className="text-slate-400">
                  ({log.chatTitle || log.chatId})
                </span>
                : {log.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    ) : (
      <div className="text-slate-400 text-xs">
        Logging is off. Turn on to see all messages received by this bot.
      </div>
    )}
  </div>
);

export default LoggingInfo;
