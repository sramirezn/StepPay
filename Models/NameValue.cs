namespace StepPay.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("NameValue")]
    public partial class NameValue
    {
        [Key]
        public int IDNameValue { get; set; }

        [Required]
        [StringLength(100)]
        public string Descripcion { get; set; }

        public string Codigo { get; set; }

        public int IDGroup { get; set; }

        public int? IDParent { get; set; }

        public int? OrderBy { get; set; }

        public bool Discarted { get; set; }

        [StringLength(100)]
        public string CustomString1 { get; set; }

        [StringLength(100)]
        public string CustomString2 { get; set; }

        [StringLength(100)]
        public string CustomString3 { get; set; }

        [StringLength(10)]
        public string CustomInt1 { get; set; }

        [StringLength(10)]
        public string CustomInt2 { get; set; }

        [StringLength(10)]
        public string CustomInt3 { get; set; }

        [StringLength(150)]
        public string Create_User { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime Create_Date { get; set; }

        [StringLength(150)]
        public string Update_User { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime? Update_Date { get; set; }

        [StringLength(150)]
        public string Delete_User { get; set; }

        [Column(TypeName = "smalldatetime")]
        public DateTime? Delete_Date { get; set; }

        public bool? Isdeleted { get; set; }
    }
}
