﻿using System.Collections.Generic;
using System.Web.Http;

namespace ToTangoAPI.Controllers
{
    public class CompanyController : BaseApiController
    {
        // GET: Search/Company
        public IHttpActionResult Get()
        {
            return Error("You forgot to enter the company");
        }

        // GET: Search/Company/abc
        public IHttpActionResult Get(string id)
        {
            string myQueryUrl = QueryUrl("ToTangoUrlCompanyQuery").Replace("@NAME@", id);
            return ToTangoPost(myQueryUrl);
        }
    }
}
