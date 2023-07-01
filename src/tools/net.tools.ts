import net from 'net'

export class NetTools {
  isPortBusy(port: number) {
    return new Promise((resolve, reject) => {
      const server = net.createServer()
        .once('error', (error: Error) => {
          if (error.message.includes('EADDRINUSE')) {
            resolve(true);
          } else {
            reject(error);
          }
        })
        .once('listening', () => {
          server.close();
          resolve(false);
        })
        .listen(port);
    });
  }

  checkIpVersion(ip: string): number {
    if (ip.includes(':')) {
      return 6;
    } else {
      return 4;
    }
  }
}