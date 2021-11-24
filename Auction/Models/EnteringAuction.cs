using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Auction.Models
{
    public class EnteringAuction
    {
        public string Invite { get; set; }
        public string ModId { get; set; }
        [StringLength(10,ErrorMessage ="Name Must Be Longer than 2 Characters And Shorter Than 10 Characters",MinimumLength =3)]
        [Required]
        public string Name { get; set; }
    }
}
