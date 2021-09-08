namespace Auction.EfCore.Models
{
    public class Item
    {
        public int ItemId { get; set; }
        public int StartingPrice { get; set; }
        public string Name { get; set; }
        public int AuctionId { get; set; }
        public virtual Auction Auction { get; set; }
    }
}