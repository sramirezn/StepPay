
using StepPay.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StepPay.Models
{
    public class ClienteWithAddress
    {
        public Cliente Client { get; set; }
        public ICollection<Direccion> Addresses { get; set; }
    }
}
