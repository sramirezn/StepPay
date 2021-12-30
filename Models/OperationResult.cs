using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Models
{
    public class OperationResult<T> where T:class
    {
        public bool Result { get; set; }
        public T Entity { get; set; }
        public string ErrorMessage { get; set; }
        public int StatusCode { get; set; }

        public OperationResult(bool result)
        {
            Result = result;
        }    
    }
}
