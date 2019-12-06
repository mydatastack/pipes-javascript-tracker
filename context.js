var campaign_name = '';
var campaign_source = '';
var campaign_medium = '';
var campaign_term = '';
var campaign_content = '';
var page_path = window.location.pathname;
var page_referrer = document.referrer;
var ip = '0.0.0.0';
var page_search = '';
var page_title = document.title;
var page_url = window.location.href;
var user_agent = navigator.userAgent;

var context = {
  page_path: page_path,
  page_referrer: page_referrer,
  ip: ip,
  page_search: page_search,
  page_title: page_title,
  page_url: page_url,
  user_agent: user_agent
}

module.exports = context
