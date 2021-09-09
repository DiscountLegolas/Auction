using Auction.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace Auction.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly EfCore.AuctionDbContext _context;

        public HomeController(ILogger<HomeController> logger,EfCore.AuctionDbContext context)
        {
            _context = context;
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public IActionResult Index(EnteringAuction entering)
        {
            if (_context.Auctions.Any(x=>x.Invite==entering.Invite&&x.Open==true)&&entering.Name!=null&&entering.Name.Length>2)
            {
                var auction = _context.Auctions.Single(x => x.Invite == entering.Invite);
                TempData["Name"] = entering.Name;
                if (entering.ModId== auction.ModeratorId)
                {
                    TempData["İsMod"] = true;
                }
                else
                {
                    TempData["İsMod"] = false;
                }
                return RedirectToAction("Auction", new { invite = entering.Invite });
            }
            else
            {
                ViewBag.Alert = "Alert";
                return View();
            }
        }
        [Route("Auction/{invite}")]
        public IActionResult Auction(string invite)
        {
            var ismod = false;
            try
            {
                ismod = (bool)TempData["İsMod"];
            }
            catch (Exception)
            {
                
            }
            string name = (string)TempData["Name"];
            var _ıtems = _context.Auctions.Include(x => x.Items).Single(x => x.Invite == invite && x.Open == true).Items;
            var auction = new Auction.Models.Auction() { Invite = invite,IsModerator=ismod,Name=name };
            var items = new List<Item>();
            foreach (var item in _ıtems)
            {
                items.Add(new Item() {Id=item.ItemId, Name = item.Name, AçılışFiyatı = item.StartingPrice });
            }
            auction.Items = items;
            return View(auction);
        }
        [Route("BuyPage/{a}")]
        public IActionResult BuyPage(string a)
        {
            a = Regex.Replace(a, @"[^\u0000-\u007F]+", string.Empty);
            var buyedıtems = JsonConvert.DeserializeObject<List<BuyedItem>>(a);
            for (int i = 0; i < buyedıtems.Count; i++)
            {
                var item = buyedıtems[i];
                if (buyedıtems.Count(x=>x.Id==item.Id)>1)
                {
                    buyedıtems.Remove(item);
                }
            }
            ViewBag.A = buyedıtems;
            return View();
        }
        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
