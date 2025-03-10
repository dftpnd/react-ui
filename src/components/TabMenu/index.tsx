import * as React from 'react';
import { keyboardKey } from '#src/components/common/keyboardKey';
import { Badge } from '#src/components/Badge';
import type { ItemProps, RenderOptionProps } from '#src/components/Menu/MenuItem';
import { MenuItem } from '#src/components/Menu/MenuItem';

import {
  BadgeWrapper,
  IconWrapper,
  MenuItemWrapper,
  OverflowMenuContainer,
  StyledOverflowMenu,
  Tab,
  TabContent,
  TabContentWrapper,
  TabWrapper,
  Underline,
  Wrapper,
} from '#src/components/TabMenu/style';
import type { Dimension } from '#src/components/TabMenu/constants';
import type { DefaultTheme, FlattenInterpolation, ThemeProps } from 'styled-components';

export interface TabProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** Контент вкладки */
  content: React.ReactNode;
  /** Id вкладки */
  id: string;
  /** Иконка, располагается слева от content */
  icon?: React.ReactNode;
  /** Число, которое будет отображено в компоненте Badge справа от content */
  badge?: number;
  /** Отключение вкладки */
  disabled?: boolean;
}

type TabWithRefProps = TabProps & { ref: React.RefObject<HTMLButtonElement> };
type OverflowMenuRefProps = {
  ref: React.RefObject<HTMLButtonElement>;
  isVisible: boolean;
};

export interface TabMenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Список вкладок */
  tabs: Array<TabProps>;
  /** Id активной вкладки */
  activeTab: string;
  /** Колбек на изменение активной вкладки */
  onChange: (id: string) => void;
  /** Размер компонента */
  dimension?: Dimension;
  /** Отображение серой полосы снизу */
  underline?: boolean;
  /** Мобильная версия компонента */
  mobile?: boolean;
  /** Выравнивание выпадающего меню относительно компонента https://developer.mozilla.org/en-US/docs/Web/CSS/align-self */
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  /** Позволяет добавлять миксин для выпадающих меню, созданный с помощью styled css  */
  dropContainerCssMixin?: FlattenInterpolation<ThemeProps<DefaultTheme>>;
}

export const TabMenu: React.FC<TabMenuProps> = ({
  tabs,
  dimension = 'l',
  underline = false,
  mobile = false,
  alignSelf = 'flex-end',
  activeTab,
  onChange,
  dropContainerCssMixin,
  ...props
}) => {
  const [openedMenu, setOpenedMenu] = React.useState(false);
  // state for visible tabs in !mobile mode
  const [visibilityMap, setVisibilityMap] = React.useState<{ [index: number | string]: boolean }>(
    tabs.reduce<{ [index: number | string]: boolean }>((initialMap, _, index) => {
      initialMap[index] = true;
      return initialMap;
    }, {}),
  );

  // add refs to tabs
  const tabsWithRef: Array<TabWithRefProps> = React.useMemo(() => {
    return tabs.map((tab) => ({ ...tab, ref: React.createRef<HTMLButtonElement>() }));
  }, [tabs]);

  // add refs to OverflowMenus
  const overflowMenuRefs: Array<OverflowMenuRefProps> = React.useMemo(() => {
    return tabs.slice(0, tabs.length - 1).map((_, index) => ({
      ref: React.createRef<HTMLButtonElement>(),
      isVisible: visibilityMap[index] && !visibilityMap[index + 1],
    }));
  }, [tabs, visibilityMap]);

  // ref to visible OverflowMenu
  const currentOverflowMenuRef = React.useMemo(() => {
    const visibleMenu = overflowMenuRefs.find((item) => item.isVisible);
    return visibleMenu ? visibleMenu.ref : null;
  }, [overflowMenuRefs, visibilityMap]);

  // collection of visible elements for handleKeyDown
  const visibleRefsMap = React.useMemo(() => {
    let refsMap: Array<React.RefObject<HTMLButtonElement>> = [];
    if (!mobile) {
      tabsWithRef.forEach((item, index) => {
        if (visibilityMap[index]) {
          refsMap.push(item.ref);
        }
      });
      if (currentOverflowMenuRef !== null) {
        refsMap.push(currentOverflowMenuRef);
      }
    } else {
      refsMap = tabsWithRef.map((item) => item.ref);
    }
    return refsMap;
  }, [visibilityMap, tabsWithRef, currentOverflowMenuRef, overflowMenuRefs, mobile]);

  const tablistRef = React.useRef<HTMLDivElement | null>(null);
  const underlineRef = React.useRef<HTMLDivElement | null>(null);

  // defines if activeTab is visible or is in OverflowMenu in !mobile mode
  const activeTabIsVisible: boolean = React.useMemo(() => {
    const activeTabIndex = tabsWithRef.findIndex((item) => item.id === activeTab);
    return visibilityMap[activeTabIndex];
  }, [tabsWithRef, activeTab, visibilityMap]);

  // model of all tabs for OverflowMenus
  const modelAllTabs = React.useMemo(() => {
    return tabsWithRef.map((item) => {
      return {
        id: item.id,
        render: (options: RenderOptionProps) => (
          <MenuItem dimension={dimension} {...options} key={item.id}>
            <MenuItemWrapper>
              {item.icon && <IconWrapper dimension={dimension}>{item.icon}</IconWrapper>}
              {item.content}
              {typeof item.badge !== 'undefined' && (
                <BadgeWrapper>
                  <Badge
                    data-badge
                    dimension="s"
                    appearance={item.id === activeTab ? 'info' : item.disabled ? 'lightDisable' : 'lightInactive'}
                  >
                    {item.badge}
                  </Badge>
                </BadgeWrapper>
              )}
            </MenuItemWrapper>
          </MenuItem>
        ),
        disabled: item.disabled,
      };
    });
  }, [dimension, tabs, tabsWithRef]);

  const containsActiveTab = (items: Array<ItemProps>) => {
    return items.findIndex((item) => item.id === activeTab) != -1;
  };

  const getNextElement = (target: HTMLElement) => {
    let currentIndex = visibleRefsMap.findIndex((item) => target === item.current);
    if (currentIndex < visibleRefsMap.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    return visibleRefsMap[currentIndex].current;
  };

  const getNextFocus = (target: HTMLElement) => {
    let nextElement = getNextElement(target);
    while (nextElement?.disabled) {
      nextElement = getNextElement(nextElement);
    }
    return nextElement;
  };

  const getPreviousElement = (target: HTMLElement) => {
    let currentIndex = visibleRefsMap.findIndex((item) => target === item.current);
    if (currentIndex === 0) {
      currentIndex = visibleRefsMap.length - 1;
    } else {
      currentIndex--;
    }
    return visibleRefsMap[currentIndex].current;
  };

  const getPreviousFocus = (target: HTMLElement) => {
    let previousElement = getPreviousElement(target);
    while (previousElement?.disabled) {
      previousElement = getPreviousElement(previousElement);
    }
    return previousElement;
  };

  const styleUnderline = (left: number, width: number) => {
    if (underlineRef.current) {
      underlineRef.current.style.left = left + 'px';
      underlineRef.current.style.width = width + 'px';
      if (width) {
        underlineRef.current.style.display = 'flex';
      } else {
        underlineRef.current.style.display = 'none';
      }
    }
  };

  const setUnderline = () => {
    const activeTabRef = tabsWithRef.filter((tab) => tab.id === activeTab)?.[0]?.ref.current;
    const left = parseFloat(underlineRef.current?.style.left || '0');
    const underlineWidth = parseFloat(underlineRef.current?.style.width || '0');

    if (activeTabRef && tablistRef.current) {
      // используем метод getBoundingClientRect, так как он дает точность до сотых пикселя
      const activeTabWidth = activeTabRef.getBoundingClientRect().width;
      const activeTabLeft =
        activeTabRef.getBoundingClientRect().left -
        tablistRef.current.getBoundingClientRect().left +
        tablistRef.current.scrollLeft;

      if (activeTabLeft !== left || activeTabWidth !== underlineWidth) {
        styleUnderline(activeTabLeft, activeTabWidth);
      }
    }
    if (!activeTabRef || (!mobile && !activeTabIsVisible)) {
      styleUnderline(0, 0);
    }
  };

  React.useLayoutEffect(() => setUnderline(), [tabsWithRef, activeTab, dimension, visibilityMap]);

  // recalculation on resize. For example, it happens after fonts loading
  React.useLayoutEffect(() => {
    if (tablistRef.current?.firstElementChild) {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach(() => {
          setUnderline();
        });
      });
      resizeObserver.observe(tablistRef.current?.firstElementChild);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [tablistRef.current]);

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    const updatedEntries: { [index: number | string]: boolean } = {};
    entries.forEach((entry: any) => {
      const target = entry.target;
      const targetNumber = target.dataset.number;

      updatedEntries[targetNumber] = entry.isIntersecting && entry.intersectionRatio === 1.0;
    });

    setVisibilityMap((prev: { [index: number | string]: boolean }) => ({
      ...prev,
      ...updatedEntries,
    }));
  };

  React.useLayoutEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: tablistRef.current,
      threshold: [0, 1.0],
    });

    if (tablistRef.current && !mobile) {
      Array.from(tablistRef.current.children).forEach((item) => {
        observer.observe(item);
      });
    }
    return () => observer.disconnect();
  }, [tablistRef, mobile, setVisibilityMap]);

  const handleTabClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    mobile && event.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    onChange(event.currentTarget.id);
    event.currentTarget.blur();
  };

  const handleTabKeyUp = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const code = keyboardKey.getCode(event);
    if (code === keyboardKey.Enter || code === keyboardKey[' ']) {
      onChange(event.currentTarget.id);
    }
  };

  const handleTabsWrapperKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { target } = event;
    let newFocusTarget;

    const code = keyboardKey.getCode(event);
    switch (code) {
      case keyboardKey.Tab:
        if (!activeTabIsVisible) {
          newFocusTarget = currentOverflowMenuRef;
          event.preventDefault();
        }
        break;
      case keyboardKey.ArrowLeft:
        newFocusTarget = getPreviousFocus(target as HTMLElement);
        event.preventDefault();
        break;
      case keyboardKey.ArrowRight:
        newFocusTarget = getNextFocus(target as HTMLElement);
        event.preventDefault();
        break;
      default:
        break;
    }

    if (!openedMenu && newFocusTarget) {
      (newFocusTarget as HTMLElement).focus();
    }
  };

  const getTabIndex = (id: string) => {
    return tabsWithRef.findIndex((item) => item.id === id);
  };

  const renderOverflowMenu = (id: string) => {
    const tabNumber = getTabIndex(id);
    const tabsForMenu = modelAllTabs.slice(tabNumber + 1);
    const overflowMenuHidden =
      tabNumber === tabsWithRef.length - 1 || !(visibilityMap[tabNumber] && !visibilityMap[tabNumber + 1]);
    const tabIndex = overflowMenuHidden || !tabsForMenu?.filter((item) => item.id === activeTab).length ? -1 : 0;
    const overflowRef = overflowMenuRefs[tabNumber] ? overflowMenuRefs[tabNumber].ref : null;

    return (
      <OverflowMenuContainer dimension={dimension} isHidden={overflowMenuHidden}>
        <StyledOverflowMenu
          ref={overflowRef}
          onOpen={() => setOpenedMenu(true)}
          onClose={() => setOpenedMenu(false)}
          alignSelf={alignSelf}
          items={overflowMenuHidden ? [] : tabsForMenu}
          selected={containsActiveTab(tabsForMenu) ? activeTab : undefined}
          dimension={dimension}
          isActive={containsActiveTab(tabsForMenu)}
          disabled={tabsForMenu.every((tab) => tab.disabled)}
          onChange={(id: string) => {
            onChange(id);
            styleUnderline(0, 0);
          }}
          tabIndex={tabIndex}
          dropContainerCssMixin={dropContainerCssMixin}
        />
      </OverflowMenuContainer>
    );
  };

  const renderTab = (item: TabWithRefProps) => {
    const { disabled, content, id, icon, badge, ref, ...props } = item;

    return (
      <Tab
        ref={ref}
        key={id}
        id={id}
        role="tab"
        type="button"
        aria-selected={id === activeTab}
        selected={id === activeTab}
        tabIndex={id === activeTab ? 0 : -1}
        dimension={dimension}
        disabled={disabled}
        onClick={handleTabClick}
        onKeyUp={handleTabKeyUp}
        {...props}
      >
        <TabContentWrapper dimension={dimension} tabIndex={-1}>
          {icon && icon}
          <TabContent>{content}</TabContent>
          {typeof badge !== 'undefined' && (
            <Badge
              data-badge
              dimension="s"
              appearance={id === activeTab ? 'info' : disabled ? 'lightDisable' : 'lightInactive'}
            >
              {badge}
            </Badge>
          )}
        </TabContentWrapper>
      </Tab>
    );
  };

  const renderTabs = () => {
    return tabsWithRef.map((item: TabWithRefProps, index) => {
      const { id } = item;
      const tabNumber = getTabIndex(id);
      const needsOffset = !mobile && tabNumber !== 0 && visibilityMap[tabNumber - 1];

      return (
        <TabWrapper key={id} data-number={index} $needsOffset={needsOffset} dimension={dimension}>
          {renderTab(item)}
          {mobile || tabNumber === tabsWithRef.length - 1 ? null : renderOverflowMenu(id)}
        </TabWrapper>
      );
    });
  };

  return (
    <Wrapper
      role="tablist"
      ref={tablistRef}
      underline={underline}
      mobile={mobile}
      dimension={dimension}
      onKeyDown={handleTabsWrapperKeyDown}
      {...props}
    >
      {renderTabs()}
      <Underline ref={underlineRef} aria-hidden />
    </Wrapper>
  );
};

TabMenu.displayName = 'TabMenu';
