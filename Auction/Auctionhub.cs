using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Auction
{
    public class Auctionhub:Hub
    {
        public Task SendCurrentAuctionValue(string value,string groupname,string name,string connectionıd)
        {
            return Clients.Group(groupname).SendAsync("ReceiveCurrentAuctionValue", value,name,connectionıd);
        }
        public Task JoinGroup(string groupname)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId,groupname);
        }
        public Task NextObj(string groupname,string number)
        {
            return Clients.GroupExcept(groupname,Context.ConnectionId).SendAsync("ReceiveNextObj", number);
        }
    }
}
