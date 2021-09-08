using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Auction.Models
{
    public class Auction
    {
        public string Name { get; set; }
        public bool IsModerator { get; set; }
        public string Invite { get; set; }
        public List<Item> Items { get; set; }
    }
}
