import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { Subscription } from "rxjs";
import { SidebarService, ISidebar } from "../sidebar/sidebar.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LangService, Language } from "src/app/shared/lang.service";
import { AuthService } from "src/app/shared/auth.service";
import { environment } from "src/environments/environment";
import { getThemeColor, setThemeColor } from "src/app/utils/util";
import { ProjectPricingService, UserDetail } from "src/app/views/app/pricingtool/projectpricing.service";

@Component({
  selector: "app-topnav",
  templateUrl: "./topnav.component.html",
})
export class TopnavComponent implements OnInit, OnDestroy {
  buyUrl = environment.buyUrl;
  adminRoot = environment.adminRoot;
  sidebar: ISidebar;
  subscription: Subscription;
  displayName = "Sarah Cortney";
  languages: Language[];
  currentLanguage: string;
  isSingleLang;
  isFullScreen = false;
  isDarkModeActive = false;
  searchKey = "";
  userDetails: UserDetail = {
    UserId: 0,
    UserRegDate: '',
    Level: '',
    IsAdmin: '',
    IsActivated: '',
    ToDelete: '',
    Location: '',
    SelectedServiceTypes: [],
    displayName: '',
    email: '',
    MobileNo: '',
    WorkSchedule: 0,
    FromAdmin:'',
    ProfileImage:''
  };


  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private router: Router,
    private langService: LangService,
    private route: ActivatedRoute,
    private projectPricingService: ProjectPricingService
  ) {
    this.languages = this.langService.supportedLanguages;
    this.currentLanguage = this.langService.languageShorthand;
    this.isSingleLang = this.langService.isSingleLang;
    this.isDarkModeActive = getThemeColor().indexOf("dark") > -1 ? true : false;

    this.projectPricingService.fetchUserInfo().subscribe(
      userDetail=>{
        this.userDetails =userDetail['userDetails'][0];
      

      }
    )
  }

  onDarkModeChange(event) {
    let color = getThemeColor();
    if (color.indexOf("dark") > -1) {
      color = color.replace("dark", "light");
    } else if (color.indexOf("light") > -1) {
      color = color.replace("light", "dark");
    }
    setThemeColor(color);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  fullScreenClick() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  @HostListener("document:fullscreenchange", ["$event"])
  handleFullscreen(event) {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  onLanguageChange(lang) {
    this.langService.language = lang.code;
    this.currentLanguage = this.langService.languageShorthand;
  }

  async ngOnInit() {
    if (await this.authService.getUser()) {
      this.displayName = await this.authService.getUser().then((user) => {
        return user.displayName;
      });
    }
    this.subscription = this.sidebarService.getSidebar().subscribe(
      (res) => {
        this.sidebar = res;
      },
      (err) => {
        console.error(`An error occurred: ${err.message}`);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  menuButtonClick = (
    e: { stopPropagation: () => void },
    menuClickCount: number,
    containerClassnames: string
  ) => {
    if (e) {
      e.stopPropagation();
    }

    setTimeout(() => {
      const event = document.createEvent("HTMLEvents");
      event.initEvent("resize", false, false);
      window.dispatchEvent(event);
    }, 350);

    this.sidebarService.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.sidebar.selectedMenuHasSubItems
    );
  };

  mobileMenuButtonClick = (
    event: { stopPropagation: () => void },
    containerClassnames: string
  ) => {
    if (event) {
      event.stopPropagation();
    }
    this.sidebarService.clickOnMobileMenu(containerClassnames);
  };

  onAccount(){
    this.router.navigate(['/app/mydashboard'], { relativeTo: this.route });
  }

  onSignOut() {
    // this.authService.signOut().subscribe(() => {
      localStorage.removeItem("UserId");
      localStorage.removeItem("UserName");
      localStorage.removeItem("IsAuthenticated");
      localStorage.removeItem("EmailId");
      localStorage.removeItem("Level");
      localStorage.removeItem("IsAdmin");
      this.router.navigate(['/login'], { relativeTo: this.route });
   // });
  }

  searchKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      this.search();
    } else if (event.key === "Escape") {
      const input = document.querySelector(".mobile-view");
      if (input && input.classList) {
        input.classList.remove("mobile-view");
      }
      this.searchKey = "";
    }
  }

  searchAreaClick(event) {
    event.stopPropagation();
  }
  searchClick(event) {
    if (window.innerWidth < environment.menuHiddenBreakpoint) {
      let elem = event.target;
      if (!event.target.classList.contains("search")) {
        if (event.target.parentElement.classList.contains("search")) {
          elem = event.target.parentElement;
        } else if (
          event.target.parentElement.parentElement.classList.contains("search")
        ) {
          elem = event.target.parentElement.parentElement;
        }
      }

      if (elem.classList.contains("mobile-view")) {
        this.search();
        elem.classList.remove("mobile-view");
      } else {
        elem.classList.add("mobile-view");
      }
    } else {
      this.search();
    }
    event.stopPropagation();
  }

  search() {
    if (this.searchKey && this.searchKey.length > 1) {
      this.router.navigate([this.adminRoot + "/#"], {
        queryParams: { key: this.searchKey.toLowerCase().trim() },
      });
      this.searchKey = "";
    }
  }

  @HostListener("document:click", ["$event"])
  handleDocumentClick(event) {
    const input = document.querySelector(".mobile-view");
    if (input && input.classList) {
      input.classList.remove("mobile-view");
    }
    this.searchKey = "";
  }
}
