using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Auction.EfCore.Models
{
    public class Auction
    {
        public int AuctionId { get; set; }
        public string Invite { get; set; }
        public string ModeratorId { get; set; }
        public bool Open { get; set; }
        public virtual ICollection<Item> Items { get; set; }
    }
}
