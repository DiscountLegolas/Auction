using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Auction.EfCore.Models;

namespace Auction.EfCore
{
    public class AuctionDbContext:DbContext
    {
        public AuctionDbContext(DbContextOptions<AuctionDbContext> options):base(options)
        {

        }
        public DbSet<Models.Auction> Auctions { get; set; }
        public DbSet<Item> Items { get; set; }

    }
}
