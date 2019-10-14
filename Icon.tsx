/**
 * @file 图标组件
 * @description 即支持字体icon，也支持彩色的svg版本
 * @author 2018.04.26
 */
import * as React from 'react';
import * as classNames from 'classnames';

interface IconProps {
  /** 图标类型 */
  type: string;
  /** 图表颜色，默认为iconfont方案的单色；当为color时，取svg方案；若此时为彩色即可显示彩色Icon */
  colorful?: boolean;
  style?: any;
  className?: string;
}

export class Icon extends React.Component<IconProps, any> {
  render() {
    /** resetProps兼容AntD Icon的剩余属性，比如onClick等 */
    const { type, colorful, style, className, ...restProps } = this.props;

    let iconType = type;
    if (colorful) {
      // type的写法可能为'one-icon icon-***'，正则匹配出icon-***
      const match = type.match(/icon-[^ ]*/);
      iconType = match ? match[0] : type;
      const myClassNames = classNames('svg-icon', className);
      return (
        <svg className={myClassNames} style={style} {...restProps} aria-hidden="true">
          <use xlinkHref={`#${iconType}`} />
        </svg>
      );
    } else {
      const myClassNames = classNames('one-icon', className, iconType);

      return <i className={myClassNames} style={style} {...restProps} />;
    }
  }
}
